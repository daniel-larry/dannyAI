
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { generateAvatarUrl } from '@/utils/avatarUtils';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  onAvatarClick?: () => void;
}

// Generate a set of random avatar options
const avatarOptions = [
  { id: 'avatar-1' },
  { id: 'avatar-2' },
  { id: 'avatar-3' },
  { id: 'avatar-4' },
  { id: 'avatar-5' },
  { id: 'avatar-6' },
];

const AvatarSelector = ({ selectedAvatar, onAvatarSelect, onAvatarClick }: AvatarSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-3 gap-3">
        {avatarOptions.map((avatar) => (
          <div
            key={avatar.id}
            className={`cursor-pointer p-2 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedAvatar === avatar.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              onAvatarSelect(avatar.id);
              onAvatarClick?.();
            }}
          >
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src={generateAvatarUrl(avatar.id)} alt="Avatar option" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
