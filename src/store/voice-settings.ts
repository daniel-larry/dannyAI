
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, AllGroqKeysFailedError } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/db';

interface VoiceSettingsState {
  speechRate: number;
  speechVolume: number;
  ttsVoice: string;
  userAvatar: string;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  setTtsVoice: (voice: string) => void;
  setUserAvatar: (avatar: string) => void;
  synthesizeSpeech: (text: string, voice?: string, isStatic?: boolean, onWordCallback?: (word: string, index: number) => void, onSpeechStartCallback?: () => void, onSpeechEndCallback?: () => void) => Promise<void>;
}

// Production-ready audio playback handler
const playAudio = (audioUrl: string, onSpeechStartCallback?: () => void, onSpeechEndCallback?: () => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onplay = () => onSpeechStartCallback?.();
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl); // Essential for memory management
      onSpeechEndCallback?.();
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(audioUrl); // Clean up on error
      console.error('Audio playback error:', e);
      reject(new Error('Audio playback failed'));
    };
    // Start playback
    audio.play().catch(e => {
        URL.revokeObjectURL(audioUrl); // Clean up if play() fails immediately
        console.error('Audio play() failed:', e);
        reject(e);
    });
  });
};

// Centralized fallback logic for production
const fallbackToResponsiveVoice = (text: string, onWordCallback?: (word: string, index: number) => void, onSpeechStartCallback?: () => void, onSpeechEndCallback?: () => void): Promise<void> => {
  console.warn('[Fallback] Groq TTS unavailable. Using ResponsiveVoice.');
  toast({
    title: "Premium Voice Unavailable",
    description: "Using standard fallback voice.",
  });
  return new Promise<void>((resolve) => {
    // Using a default, reliable voice for the fallback
    (window as any).responsiveVoice.speak(text, "US English Female", {
      onstart: onSpeechStartCallback,
      onend: () => {
        onSpeechEndCallback?.();
        resolve();
      },
      onword: onWordCallback,
    });
  });
};

export const useVoiceSettingsStore = create<VoiceSettingsState>()(
  persist(
    (set, get) => ({
      speechRate: 1.0,
      speechVolume: 1.0,
      ttsVoice: 'Basil-PlayAI',
      userAvatar: 'Basil',
      setSpeechRate: (rate) => set({ speechRate: rate }),
      setSpeechVolume: (volume) => set({ speechVolume: volume }),
      setTtsVoice: (voice) => set({ ttsVoice: voice }),
      setUserAvatar: (avatar) => set({ userAvatar: avatar }),
      synthesizeSpeech: async (text, voice, isStatic = false, onWordCallback, onSpeechStartCallback, onSpeechEndCallback) => {
        const selectedVoice = voice || get().ttsVoice;
        const cacheKey = `${selectedVoice}-${text}`;

        // 1. Check cache for static content first (more robustly)
        if (isStatic) {
          try {
            const cachedAudio = await db.audioCache.get(cacheKey);
            if (cachedAudio) {
              console.log(`[Cache] HIT: Playing "${text}" from cache.`);
              const audioBlob = new Blob([cachedAudio.audioData], { type: 'audio/wav' });
              const audioUrl = URL.createObjectURL(audioBlob);
              await playAudio(audioUrl, onSpeechStartCallback, onSpeechEndCallback);
              return; // Successfully played from cache
            }
          } catch (e) {
            console.error("[Cache] Error reading from IndexedDB, will fetch from API instead:", e);
          }
        }

        // 2. Attempt to fetch from Groq API
        try {
          console.log(`[API] Requesting TTS for "${text}" with voice "${selectedVoice}".`);
          const response = await apiClient.post(
            "https://api.groq.com/openai/v1/audio/speech",
            {
              model: "playai-tts",
              voice: selectedVoice,
              input: text,
              response_format: "wav"
            }
          );

          const audioBlob = await response.blob();
          const audioData = await audioBlob.arrayBuffer();

          // Cache the new audio if it's static content
          if (isStatic && audioData.byteLength > 0) {
            console.log(`[Cache] STORE: Caching "${text}".`);
            await db.audioCache.put({ id: cacheKey, audioData: new Uint8Array(audioData), createdAt: new Date() });
          }

          // Play the fetched audio
          const audioUrl = URL.createObjectURL(audioBlob);
          await playAudio(audioUrl, onSpeechStartCallback, onSpeechEndCallback);

        } catch (error) {
          console.error('Error synthesizing speech with Groq:', error);
          // 3. If any error occurs (including AllGroqKeysFailedError), fallback gracefully
          await fallbackToResponsiveVoice(text, onWordCallback, onSpeechStartCallback, onSpeechEndCallback);
        }
      },
    }),
    {
      name: 'danny-voice-settings',
    }
  )
);
