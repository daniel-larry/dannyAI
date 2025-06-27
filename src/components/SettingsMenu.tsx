import React from 'react';
import { Menu, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AccessibilitySettings from './AccessibilitySettings';
import ProfileSettings from './ProfileSettings';

interface SettingsMenuProps {
  speechRate: number;
  speechVolume: number;
  selectedVoice: string;
  onSpeechRateChange: (rate: number) => void;
  onSpeechVolumeChange: (volume: number) => void;
  onVoiceChange: (voice: string) => void;
  userContext: string;
  onUserContextChange: (context: string) => void;
  userAvatar: string;
  userName: string;
  setShowDocumentationModal: (show: boolean) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  speechRate,
  speechVolume,
  selectedVoice,
  onSpeechRateChange,
  onSpeechVolumeChange,
  onVoiceChange,
  userContext,
  onUserContextChange,
  userAvatar,
  userName,
  setShowDocumentationModal,
}) => {
  return (
    <>
      {/* Desktop Settings Menu */}
      <div className="hidden md:flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Settings">
              <SettingsIcon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-4">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <AccessibilitySettings
              speechRate={speechRate}
              speechVolume={speechVolume}
              selectedVoice={selectedVoice}
              onSpeechRateChange={onSpeechRateChange}
              onSpeechVolumeChange={onSpeechVolumeChange}
              onVoiceChange={onVoiceChange}
            />
            <ProfileSettings
              userContext={userContext}
              onUserContextChange={onUserContextChange}
              userAvatar={userAvatar}
              userName={userName}
            />
            <DropdownMenuItem onSelect={() => setShowDocumentationModal(true)} className="cursor-pointer">
              <BookOpen className="h-4 w-4 mr-2" /> Documentation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Settings Sheet */}
      <div className="md:hidden flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 py-4">
              <AccessibilitySettings
                speechRate={speechRate}
                speechVolume={speechVolume}
                selectedVoice={selectedVoice}
                onSpeechRateChange={onSpeechRateChange}
                onSpeechVolumeChange={onSpeechVolumeChange}
                onVoiceChange={onVoiceChange}
              />
              <ProfileSettings
                userContext={userContext}
                onUserContextChange={onUserContextChange}
                userAvatar={userAvatar}
                userName={userName}
              />
              <Button
                variant="ghost"
                className="w-full justify-start"
                title="View Documentation"
                onClick={() => setShowDocumentationModal(true)}
              >
                <BookOpen className="h-4 w-4 mr-2" /> Documentation
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default SettingsMenu;
