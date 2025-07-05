
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import { AllGroqKeysFailedError } from '@/lib/api-client';

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

        try {
          if (isStatic) {
            const cachedAudio = await db.audioCache.get(cacheKey);
            if (cachedAudio) {
              console.log(`[Cache] HIT: Retrieving audio for "${text}" with voice "${selectedVoice}" from IndexedDB.`);
              const audioBlob = new Blob([cachedAudio.audioData], { type: 'audio/wav' });
              const audioUrl = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioUrl);
              return new Promise<void>((resolve) => {
                audio.onplay = () => {
                  console.log('[synthesizeSpeech] Cached audio playback started. Calling onSpeechStartCallback.');
                  if (onSpeechStartCallback) onSpeechStartCallback();
                };
                audio.onended = () => {
                  URL.revokeObjectURL(audioUrl); // Clean up the object URL
                  if (onSpeechEndCallback) onSpeechEndCallback();
                  resolve();
                };
                audio.onerror = (e) => {
                  URL.revokeObjectURL(audioUrl); // Clean up the object URL
                  console.error('Audio playback error:', e);
                  resolve(); // Resolve even on error to prevent hanging
                };
                audio.play();
              });
            }
          }

          console.log(`[Cache] MISS: Fetching new audio for "${text}" with voice "${selectedVoice}".`);
          console.log(`API Call - Voice: ${selectedVoice}`);
          console.log(`API Call - Avatar: ${get().userAvatar}`);
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

          if (isStatic) {
            console.log(`[Cache] STORE: Storing new audio for "${text}" with voice "${selectedVoice}" in IndexedDB.`);
            await db.audioCache.put({
              id: cacheKey,
              audioData: new Uint8Array(audioData),
              createdAt: new Date(),
            });
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          return new Promise<void>((resolve, reject) => {
            audio.onplay = () => {
              console.log('[synthesizeSpeech] Uncached audio playback started. Calling onSpeechStartCallback.');
              if (onSpeechStartCallback) onSpeechStartCallback();
            };
            audio.onended = () => {
              URL.revokeObjectURL(audioUrl); // Clean up the object URL
              if (onSpeechEndCallback) onSpeechEndCallback(); // Call the new callback
              resolve();
            };
            audio.onerror = (e) => {
              URL.revokeObjectURL(audioUrl); // Clean up the object URL
              console.error('Audio playback error:', e);
              reject(new Error('Audio playback failed'));
            };
            audio.play();
          });
        } catch (error) {
          console.error('Error synthesizing speech:', error);
          if (error instanceof AllGroqKeysFailedError) {
            toast({
              title: "All Groq API keys failed",
              description: "Falling back to ResponsiveVoice.",
            });
            return new Promise<void>((resolve) => {
              (window as any).responsiveVoice.speak(text, "", {
                onend: () => { // ResponsiveVoice has an onend callback
                  if (onSpeechEndCallback) onSpeechEndCallback();
                  resolve();
                },
                onword: (word: string, index: number) => {
                  if (onWordCallback) {
                    onWordCallback(word, index);
                  }
                },
                onstart: () => { // ResponsiveVoice has an onstart callback
                  console.log('[synthesizeSpeech] ResponsiveVoice playback started. Calling onSpeechStartCallback.');
                  if (onSpeechStartCallback) onSpeechStartCallback();
                }
              });
            });
          } else {
            toast({
              title: "Groq API failed",
              description: "Falling back to ResponsiveVoice.",
            });
            return new Promise<void>((resolve) => {
              (window as any).responsiveVoice.speak(text, "", {
                onend: () => { // ResponsiveVoice has an onend callback
                  if (onSpeechEndCallback) onSpeechEndCallback();
                  resolve();
                },
                onword: (word: string, index: number) => {
                  if (onWordCallback) {
                    onWordCallback(word, index);
                  }
                },
                onstart: () => { // ResponsiveVoice has an onstart callback
                  if (onSpeechStartCallback) onSpeechStartCallback();
                }
              });
            });
          }
        }
      },
    }),
    {
      name: 'danny-voice-settings',
    }
  )
);
