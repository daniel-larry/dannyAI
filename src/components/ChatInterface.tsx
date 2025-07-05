import React from 'react';
import { Mic, MicOff, Send, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AnimatedAssistant from '@/components/AnimatedAssistant';
import UserAvatar from '@/components/UserAvatar';
import { Message } from '@/hooks/use-chat';

type DannyState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';
type InputMode = 'voice' | 'text';

interface ChatInterfaceProps {
  dannyState: DannyState;
  setDannyState: React.Dispatch<React.SetStateAction<DannyState>>;
  currentTranscript: string;
  currentResponse: string;
  highlightedWordIndex: number;
  inputMode: InputMode;
  handleInputModeChange: (mode: InputMode) => void;
  isSupported: boolean;
  isMicActive: boolean;
  startListening: () => void;
  textInput: string;
  setTextInput: (text: string) => void;
  handleTextSubmit: (e: React.FormEvent) => void;
  messages: Message[];
  userAvatar: string;
  userName: string | null;
  synthesizeSpeech: (text: string, voiceURI?: string, isWelcome?: boolean, onWordBoundary?: (word: string, index: number) => void, onSpeechStart?: () => void, onSpeechEnd?: () => void) => Promise<void>;
  setHighlightedWordIndex: React.Dispatch<React.SetStateAction<number>>;
  stopListening: () => void;
  isSpeakingStarted: boolean;
  setIsSpeakingStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  dannyState,
  setDannyState,
  currentTranscript,
  currentResponse,
  highlightedWordIndex,
  inputMode,
  handleInputModeChange,
  isSupported,
  isMicActive,
  startListening,
  textInput,
  setTextInput,
  handleTextSubmit,
  messages,
  userAvatar,
  userName,
  synthesizeSpeech,
  setHighlightedWordIndex,
  stopListening,
  isSpeakingStarted,
  setIsSpeakingStarted,
}) => {
  const getStatusText = () => {
    switch (dannyState) {
      case 'listening': return 'Listening...';
      case 'thinking': return 'Danny is thinking...';
      case 'speaking': return 'Danny is speaking...';
      case 'error_api': return 'API Error: Please try again.';
      case 'error_speech_recognition': return 'Speech Recognition Error: Please try again.';
      default:
        return userName 
          ? `Hi ${userName}! Ask me an educational question.`
          : "Hi! I'm Danny. Let's get started.";
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="relative inline-block mb-6">
          <AnimatedAssistant state={dannyState} />
        </div>
        
        <div className="mb-6">
          <p className="text-lg font-medium text-gray-700 mb-4">{getStatusText()}</p>
          {dannyState === 'listening' && currentTranscript && (
            <div className={`text-sm text-gray-600 mt-2 p-3 bg-white rounded-lg shadow-sm border ${dannyState === 'listening' ? 'animate-pulse-once' : ''}`}>
              <span className="font-medium text-gray-800">You:</span> 🎤 {currentTranscript}
            </div>
          )}
          {(dannyState === 'speaking' || dannyState === 'error_api') && currentResponse && (
            <div className="text-sm text-gray-700 mt-2 p-3 bg-yellow-50 rounded-lg shadow-sm border" style={{ opacity: isSpeakingStarted ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}>
              <span className="font-medium text-gray-800">Danny:</span>{' '}
              {currentResponse.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={index === highlightedWordIndex ? 'bg-yellow-200 rounded-sm px-1' : ''}
                >
                  {word}{' '}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={inputMode === 'voice' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleInputModeChange('voice')}
              disabled={!isSupported}
              className={`mr-1 ${inputMode === 'voice' ? 'bg-purple-500 text-white hover:bg-purple-600' : ''}`}
              title="Switch to Voice Input"
            >
              <Mic className="w-4 h-4 mr-1" /> Voice
            </Button>
            <Button
              variant={inputMode === 'text' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleInputModeChange('text')}
              title="Switch to Text Input"
            >
              <Type className="w-4 h-4 mr-1" /> Text
            </Button>
          </div>
        </div>

        {inputMode === 'voice' ? (
          <>
            <Button
              onClick={startListening}
              disabled={!isSupported || dannyState === 'speaking'}
              size="lg"
              title={isMicActive ? "Stop Listening" : "Start Listening"}
              variant={isMicActive ? "recording" : "default"}
              className={!isMicActive && dannyState === 'idle' ? 'pulse-effect' : ''}
            >
              {isMicActive ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
            </Button>
            {!isMicActive && dannyState === 'idle' && (
              <p className="text-sm text-gray-500 mt-2">Click to Speak</p>
            )}
          </>
        ) : (
          <form onSubmit={handleTextSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Type your question..."
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                if (dannyState === 'idle' && e.target.value.length > 0) {
                  setDannyState('thinking');
                } else if (dannyState === 'thinking' && e.target.value.length === 0) {
                  setDannyState('idle');
                }
                stopListening();
              }}
              onFocus={stopListening}
            />
            <Button type="submit" disabled={!textInput.trim() || dannyState === 'speaking' || dannyState === 'listening'} title="Send Message">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>

      {messages.length > 0 && (
        <Card className="p-6 bg-white/80">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((entry) => (
              <div
                key={entry.id}
                className={`p-4 rounded-xl ${entry.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}
                onClick={() => entry.sender === 'ai' && synthesizeSpeech(entry.text, undefined, false, (word: string, index: number) => {
                  setHighlightedWordIndex(index);
                }, () => setIsSpeakingStarted(true))}
              >
                <div className="flex items-start gap-2">
                  {entry.sender === 'user' ? (
                    <UserAvatar avatarId={userAvatar} userName={userName} size="sm" />
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                      D
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-sm text-gray-600">
                      {entry.sender === 'user' ? (userName || 'You') : 'Danny'}
                    </span>
                    <p className="text-gray-800">{entry.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatInterface;