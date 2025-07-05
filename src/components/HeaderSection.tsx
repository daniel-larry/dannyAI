import React from 'react';
import { Menu, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import ProfileSettings from '@/components/ProfileSettings';

interface HeaderSectionProps {
  userContext: string;
  onUserContextChange: (context: string) => void;
  userAvatar: string;
  userName: string | null;
  setShowDocumentationModal: (show: boolean) => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  userContext,
  onUserContextChange,
  userAvatar,
  userName,
  setShowDocumentationModal,
}) => {
  return (
    <div className="text-center mb-8 pt-8">
      <div className="flex items-center justify-between mb-2">
        <div className="hidden md:block w-16"></div> {/* Placeholder for alignment on desktop */}
        <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Danny: Your Learning Assistant</h1>
        <div className="hidden md:flex items-center space-x-2">
          <AccessibilitySettings />
          <ProfileSettings userContext={userContext} onUserContextChange={onUserContextChange} userAvatar={userAvatar} userName={userName} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDocumentationModal(true)}
            title="View Documentation"
          >
            <BookOpen className="h-6 w-6" />
          </Button>
        </div>
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
                <AccessibilitySettings />
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  title="View Documentation"
                  onClick={() => setShowDocumentationModal(true)}
                >
                  <BookOpen className="h-4 w-4 mr-2" /> Documentation
                </Button>
                <ProfileSettings userContext={userContext} onUserContextChange={onUserContextChange} userAvatar={userAvatar} userName={userName} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <p className="text-gray-600">Voice-powered AI assistant for educational support</p>
    </div>
  );
};

export default HeaderSection;