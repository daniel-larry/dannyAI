
import React from 'react';
import { Settings, Volume2, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import AvatarSelector from './AvatarSelector';
import { useVoiceSettings } from '@/hooks/use-voice-settings';

const AccessibilitySettings = () => {
  const {
    speechRate,
    speechVolume,
    userAvatar,
    setSpeechRate,
    setSpeechVolume,
    setTtsVoice,
    setUserAvatar,
    synthesizeSpeech,
  } = useVoiceSettings();

  const handleAvatarSelect = (avatarId: string) => {
    setUserAvatar(avatarId);
  };

  const handleAvatarClick = (voice: string) => {
    const voiceName = voice.split('-')[0];
    synthesizeSpeech(`Hi, I'm ${voiceName}, your companion.`, voice);
    setTtsVoice(voice);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
          title="Accessibility Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-4" align="end">
        <Card className="p-4 border-0 shadow-none">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Accessibility Settings
          </h3>
          
          <div className="space-y-6">
            <AvatarSelector
              selectedAvatar={userAvatar}
              onAvatarSelect={handleAvatarSelect}
              onAvatarClick={handleAvatarClick}
            />

            {/* Speech Rate Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-600" />
                <label className="text-sm font-medium text-gray-700">
                  Speech Rate: {speechRate.toFixed(1)}x
                </label>
              </div>
              <Slider
                value={[speechRate]}
                onValueChange={(value) => setSpeechRate(value[0])}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Slow (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Fast (2.0x)</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-green-600" />
                <label className="text-sm font-medium text-gray-700">
                  Volume: {Math.round(speechVolume * 100)}%
                </label>
              </div>
              <Slider
                value={[speechVolume]}
                onValueChange={(value) => setSpeechVolume(value[0])}
                min={0.1}
                max={1.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Quiet (10%)</span>
                <span>Normal (50%)</span>
                <span>Loud (100%)</span>
              </div>
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default AccessibilitySettings;
