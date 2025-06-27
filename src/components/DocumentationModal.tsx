import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DannyAIDocumentation from '@/components/DannyAIDocumentation';
import { BookOpen } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>DannyAI Documentation</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar">
          <DannyAIDocumentation />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentationModal;
