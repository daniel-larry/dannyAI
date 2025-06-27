
import React, { useState } from 'react';
import { Settings, Volume2, Gauge, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';

interface AccessibilitySettingsProps {
  speechRate: number;
  speechVolume: number;
  selectedVoice: string;
  onSpeechRateChange: (rate: number) => void;
  onSpeechVolumeChange: (volume: number) => void;
  onVoiceChange: (voice: string) => void;
}

const voiceOptions = [
  { value: 'UK English Male', label: 'English Male' },
  { value: 'UK English Female', label: 'English Female' },
  { value: 'US English Male', label: 'English Male 2' },
  { value: 'US English Female', label: 'English Female 2' },
  { value: 'Australian English Male', label: 'English Male 3' },
  { value: 'Australian English Female', label: 'English Female 3' },
];

const AccessibilitySettings = ({
  speechRate,
  speechVolume,
  selectedVoice,
  onSpeechRateChange,
  onSpeechVolumeChange,
  onVoiceChange
}: AccessibilitySettingsProps) => {
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
      <PopoverContent className="w-80 p-4" align="end">
        <Card className="p-4 border-0 shadow-none">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Accessibility Settings
          </h3>
          
          <div className="space-y-6">
            {/* Voice Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-purple-600" />
                <label className="text-sm font-medium text-gray-700">
                  Voice
                </label>
              </div>
              <Select value={selectedVoice} onValueChange={onVoiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {voice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                onValueChange={(value) => onSpeechRateChange(value[0])}
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
                onValueChange={(value) => onSpeechVolumeChange(value[0])}
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
