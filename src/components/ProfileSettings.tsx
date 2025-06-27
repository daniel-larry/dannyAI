
import React, { useState, useRef } from 'react';
import { Upload, Save, Trash2 } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  userContext: string;
  onUserContextChange: (context: string) => void;
  userAvatar: string;
  userName: string;
}

const ProfileSettings = ({ userContext, onUserContextChange, userAvatar, userName }: ProfileSettingsProps) => {
  const [localContext, setLocalContext] = useState(userContext);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = () => {
    onUserContextChange(localContext);
    localStorage.setItem('danny-user-context', localContext);
    toast({
      title: "Profile Updated",
      description: "Your context has been saved successfully.",
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file only.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simple text extraction for PDF (fallback approach)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          // For now, we'll add a placeholder for PDF content
          // In a real implementation, you'd use a PDF parsing library
          const pdfText = `[PDF Content from ${file.name}]\nThis is placeholder text. In a real implementation, this would contain the actual PDF content.`;
          
          const updatedContext = localContext + '\n\n' + pdfText;
          setLocalContext(updatedContext);
          setUploadedFileName(file.name);
          
          toast({
            title: "PDF Uploaded",
            description: `${file.name} has been processed and added to your context.`,
          });
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to process the PDF file.",
            variant: "destructive"
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload the file.",
        variant: "destructive"
      });
    }
  };

  const clearContext = () => {
    setLocalContext('');
    setUploadedFileName('');
    localStorage.removeItem('danny-user-context');
    onUserContextChange('');
    toast({
      title: "Context Cleared",
      description: "Your profile context has been cleared.",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
          title="Profile Settings"
        >
          <UserAvatar avatarId={userAvatar} userName={userName} size="sm" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="end">
        <Card className="p-4 border-0 shadow-none">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Profile Settings
          </h3>
          
          <div className="space-y-4">
            {/* Context Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                About You (Context for Danny)
              </label>
              <Textarea
                placeholder="Tell Danny about yourself, your interests, learning goals, etc..."
                value={localContext}
                onChange={(e) => setLocalContext(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Upload PDF Document
              </label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PDF
                </Button>
              </div>
              {uploadedFileName && (
                <p className="text-xs text-green-600">
                  ✓ {uploadedFileName} uploaded
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={clearContext}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileSettings;
