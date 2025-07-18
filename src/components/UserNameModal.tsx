
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AvatarSelector from './AvatarSelector';
import DocumentationModal from './DocumentationModal';
import { BookOpen } from 'lucide-react';
import { useVoiceSettings } from '@/hooks/use-voice-settings';

interface UserNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string, avatar: string, voice: string) => void;
}

const UserNameModal = ({
  isOpen,
  onSubmit,
}: UserNameModalProps) => {
  const [name, setName] = useState('');
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const { userAvatar, ttsVoice, setUserAvatar, setTtsVoice, synthesizeSpeech } = useVoiceSettings();

  const handleAvatarClick = (voice: string) => {
    const message = name ? `Hey ${name}, ready to learn with you!` : "Hey buddy, ready to learn with you.";
    synthesizeSpeech(message, voice, true);
    setTtsVoice(voice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), userAvatar, ttsVoice);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800">
            Welcome to Danny Ai! 👋
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            Hi there! I'm Danny, your AI learning assistant. Let's get you set up!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg py-3"
              autoFocus
            />
          </div>
          
          <AvatarSelector
            selectedAvatar={userAvatar}
            onAvatarSelect={setUserAvatar}
            onAvatarClick={handleAvatarClick}
          />
          
          <Button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-purple-600 hover:bg-blue-700 text-white py-3 text-lg font-medium border-2 border-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
          </Button>
          <Button
            type="button"
            onClick={() => setShowDocumentationModal(true)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 text-lg font-medium mt-2 border-2 border-black shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <BookOpen className="h-5 w-5 mr-2" /> View Documentation
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          Your name and avatar will be saved locally to personalize your experience.
        </p>
      </DialogContent>
      <DocumentationModal isOpen={showDocumentationModal} onOpenChange={setShowDocumentationModal} />
    </Dialog>
  );
};

export default UserNameModal;
