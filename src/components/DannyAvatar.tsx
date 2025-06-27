import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DannyAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

const DannyAvatar = ({ size = 'md' }: DannyAvatarProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      {/* You can add an AvatarImage here if you have a static image for Danny */}
      <AvatarFallback>D</AvatarFallback>
    </Avatar>
  );
};

export default DannyAvatar;
