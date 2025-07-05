import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeBackModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContinue: () => void;
  userName: string | null;
}

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({
  isOpen,
  onOpenChange,
  onContinue,
  userName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <DialogTitle>Welcome Back{userName ? `, ${userName}` : ''}!</DialogTitle>
          <DialogDescription>
            Ready to continue your learning adventure?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={onContinue} className="w-full">
            Continue Learning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeBackModal;