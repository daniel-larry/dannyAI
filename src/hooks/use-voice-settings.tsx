import { useVoiceSettingsStore } from '@/store/voice-settings';

export const useVoiceSettings = () => {
  const settings = useVoiceSettingsStore();
  return settings;
};