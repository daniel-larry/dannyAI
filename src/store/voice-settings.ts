
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';
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
  synthesizeSpeech: (text: string, voice?: string) => Promise<void>;
}

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
      synthesizeSpeech: async (text, voice) => {
        const selectedVoice = voice || get().ttsVoice;
        const cacheKey = `${selectedVoice}-${text}`;

        try {
          const cachedAudio = await db.audioCache.get(cacheKey);
          if (cachedAudio) {
            console.log(`[Cache] HIT: Retrieving audio for "${text}" with voice "${selectedVoice}" from IndexedDB.`);
            const audioBlob = new Blob([cachedAudio.audioData], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            return;
          }

          console.log(`[Cache] MISS: Fetching new audio for "${text}" with voice "${selectedVoice}".`);
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

          console.log(`[Cache] STORE: Storing new audio for "${text}" with voice "${selectedVoice}" in IndexedDB.`);
          await db.audioCache.put({
            id: cacheKey,
            audioData: new Uint8Array(audioData),
            createdAt: new Date(),
          });

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        } catch (error) {
          console.error('Error synthesizing speech:', error);
          toast({
            title: "Groq API failed",
            description: "Falling back to ResponsiveVoice.",
          });
          (window as any).responsiveVoice.speak(text);
        }
      },
    }),
    {
      name: 'danny-voice-settings',
    }
  )
);
