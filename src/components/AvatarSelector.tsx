
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { generateAvatarUrl } from '@/utils/avatarUtils';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  onAvatarClick: (voice: string) => void;
}

const avatarOptions = [
  { id: 'Basil', voice: 'Basil-PlayAI' },
  { id: 'Ruby', voice: 'Ruby-PlayAI' },
  { id: 'Gail', voice: 'Gail-PlayAI' },
  { id: 'Aaliyah', voice: 'Aaliyah-PlayAI' },
  { id: 'Adelaide', voice: 'Adelaide-PlayAI' },
  { id: 'Angelo', voice: 'Angelo-PlayAI' },
  { id: 'Arista', voice: 'Arista-PlayAI' },
  { id: 'Atlas', voice: 'Atlas-PlayAI' },
  { id: 'Briggs', voice: 'Briggs-PlayAI' },
  { id: 'Calum', voice: 'Calum-PlayAI' },
  { id: 'Celeste', voice: 'Celeste-PlayAI' },
  { id: 'Cheyenne', voice: 'Cheyenne-PlayAI' },
];

const AvatarSelector = ({ selectedAvatar, onAvatarSelect, onAvatarClick }: AvatarSelectorProps) => {
  const visibleAvatars = window.innerWidth < 640 ? avatarOptions.slice(0, 6) : avatarOptions;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {visibleAvatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`cursor-pointer p-2 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedAvatar === avatar.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              onAvatarSelect(avatar.id);
              onAvatarClick(avatar.voice);
            }}
          >
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-16 h-16">
                <AvatarImage src={generateAvatarUrl(avatar.id)} alt={`${avatar.id} avatar`} />
                <AvatarFallback>{avatar.id.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{avatar.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
