import React from 'react';
import UserNameModal from '@/components/UserNameModal';
import WelcomeBackModal from '@/components/WelcomeBackModal';
import DocumentationModal from '@/components/DocumentationModal';

interface ModalsContainerProps {
  showNameModal: boolean;
  handleUserNameSubmit: (name: string, avatar: string, voice: string) => Promise<void>;
  showWelcomeBackModal: boolean;
  setShowWelcomeBackModal: (show: boolean) => void;
  handleContinueLearning: () => void;
  userName: string | null;
  showDocumentationModal: boolean;
  setShowDocumentationModal: (show: boolean) => void;
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  showNameModal,
  handleUserNameSubmit,
  showWelcomeBackModal,
  setShowWelcomeBackModal,
  handleContinueLearning,
  userName,
  showDocumentationModal,
  setShowDocumentationModal,
}) => {
  return (
    <>
      <UserNameModal
        isOpen={showNameModal}
        onSubmit={handleUserNameSubmit}
      />
      <WelcomeBackModal
        isOpen={showWelcomeBackModal}
        onOpenChange={setShowWelcomeBackModal}
        onContinue={handleContinueLearning}
        userName={userName}
      />
      <DocumentationModal isOpen={showDocumentationModal} onOpenChange={setShowDocumentationModal} />
    </>
  );
};

export default ModalsContainer;