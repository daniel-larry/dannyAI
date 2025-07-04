import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

// Define the shape of the context state
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

// Create the context with an undefined initial value
const VoiceSettingsContext = createContext<VoiceSettingsState | undefined>(undefined);

// Create the provider component
interface VoiceSettingsProviderProps {
  children: ReactNode;
}

export const VoiceSettingsProvider: React.FC<VoiceSettingsProviderProps> = ({ children }) => {
  const [speechRate, setSpeechRateState] = useState<number>(() => {
    return parseFloat(localStorage.getItem('danny-speech-rate') || '1.0');
  });
  const [speechVolume, setSpeechVolumeState] = useState<number>(() => {
    return parseFloat(localStorage.getItem('danny-speech-volume') || '1.0');
  });
  const [ttsVoice, setTtsVoiceState] = useState<string>(() => {
    return localStorage.getItem('danny-selected-voice') || 'Basil-PlayAI';
  });
  const [userAvatar, setUserAvatarState] = useState<string>(() => {
    return localStorage.getItem('danny-user-avatar') || 'Basil';
  });

  useEffect(() => {
    localStorage.setItem('danny-speech-rate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('danny-speech-volume', speechVolume.toString());
  }, [speechVolume]);

  useEffect(() => {
    localStorage.setItem('danny-selected-voice', ttsVoice);
  }, [ttsVoice]);

  useEffect(() => {
    localStorage.setItem('danny-user-avatar', userAvatar);
  }, [userAvatar]);

  const setSpeechRate = (rate: number) => setSpeechRateState(rate);
  const setSpeechVolume = (volume: number) => setSpeechVolumeState(volume);
  const setTtsVoice = (voice: string) => setTtsVoiceState(voice);
  const setUserAvatar = (avatar: string) => setUserAvatarState(avatar);

  const synthesizeSpeech = async (text: string, voice: string = "Basil-PlayAI") => {
    try {
      const response = await apiClient.post("https://api.groq.com/openai/v1/audio/speech", {
        model: "playai-tts",
        voice,
        input: text,
        response_format: "wav"
      });

      const audioBlob = await response.blob();
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
  };

  return (
    <VoiceSettingsContext.Provider value={{
      speechRate,
      speechVolume,
      ttsVoice,
      userAvatar,
      setSpeechRate,
      setSpeechVolume,
      setTtsVoice,
      setUserAvatar,
      synthesizeSpeech
    }}>
      {children}
    </VoiceSettingsContext.Provider>
  );
};

// Create a custom hook for easy context access
export const useVoiceSettings = () => {
  const context = useContext(VoiceSettingsContext);
  if (context === undefined) {
    throw new Error('useVoiceSettings must be used within a VoiceSettingsProvider');
  }
  return context;
};
