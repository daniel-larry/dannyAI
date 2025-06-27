
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { generateAvatarUrl } from '@/utils/avatarUtils';

interface UserAvatarProps {
  avatarId: string;
  userName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ avatarId, userName, size = 'md' }: UserAvatarProps) => {
  const avatarUrl = generateAvatarUrl(avatarId);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={avatarUrl} alt={userName || 'User avatar'} />
      <AvatarFallback>{userName ? userName[0].toUpperCase() : 'U'}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
