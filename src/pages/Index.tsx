import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/use-chat';
import { useVoiceSettings } from '@/hooks/use-voice-settings';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useGeminiApi } from '@/hooks/use-gemini-api';
import ModalsContainer from '@/components/ModalsContainer';
import HeaderSection from '@/components/HeaderSection';
import ChatInterface from '@/components/ChatInterface';

type DannyState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';
type InputMode = 'voice' | 'text';

const Index = () => {
  const { state: chatState, dispatch, addMessage, loading } = useChat();
  const { messages, userName } = chatState;

  const {
    userAvatar,
    setTtsVoice,
    setUserAvatar,
    synthesizeSpeech,
  } = useVoiceSettings();

  const [dannyState, setDannyState] = useState<DannyState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [isSpeakingStarted, setIsSpeakingStarted] = useState(false); // New state for speech start
  
  // User settings
  const [userContext, setUserContext] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);

  const { handleUserInput } = useGeminiApi({ setDannyState, setCurrentResponse, setHighlightedWordIndex, userContext, setIsSpeakingStarted });

  const {
    currentTranscript,
    isSupported,
    isMicActive,
    startListening,
    stopListening,
    setCurrentTranscript,
  } = useSpeechRecognition({ setDannyState, handleUserInput, dannyState, setCurrentResponse, setIsSpeakingStarted });

  // Load user preferences from localStorage
  useEffect(() => {
    const savedUserContext = localStorage.getItem('danny-user-context');
    
    // Only show the modal if not loading and userName is null
    if (!loading && !userName) {
      setShowNameModal(true);
    }
    
    if (savedUserContext) {
      setUserContext(savedUserContext);
    }
  }, [userName, loading]);

  // Handle welcome back message for existing users after loading
  useEffect(() => {
    if (!loading && userName && !hasWelcomed) {
      setShowWelcomeBackModal(true);
    }
  }, [loading, userName, hasWelcomed]);

  // Handle user name and avatar submission
  const handleUserNameSubmit = async (name: string, avatar: string, voice: string) => {
    dispatch({ type: 'SET_USER_NAME', payload: name });
    setUserAvatar(avatar);
    setTtsVoice(voice);
    setShowNameModal(false);
    setHasWelcomed(true); // Mark as welcomed after setting username
  };

  const handleContinueLearning = () => {
    setShowWelcomeBackModal(false);
    setHasWelcomed(true);
    const welcomeBackMessage = `Hello ${userName}! Nice to be back with you on this wonderful learning adventure, where do you wanna start?`;
    console.log('[Index] handleContinueLearning: Setting dannyState to speaking');
    setDannyState('speaking');
    setCurrentResponse(welcomeBackMessage);
    setIsSpeakingStarted(true); // Set to true immediately before speech starts
    synthesizeSpeech(welcomeBackMessage, undefined, true, (word: string, index: number) => {
      setHighlightedWordIndex(index);
    }, () => {
      console.log('[Index] handleContinueLearning: onSpeechStartCallback triggered.');
    }, () => {
      console.log('[Index] handleContinueLearning: onSpeechEndCallback triggered. Setting isSpeakingStarted to false and dannyState to idle.');
      setIsSpeakingStarted(false);
      setDannyState('idle'); // Set state to idle when speech ends
    }) // Pass onSpeechStartCallback and onSpeechEndCallback
    .then(() => {
      console.log('[Index] handleContinueLearning: synthesizeSpeech promise resolved.');
      setCurrentResponse(''); // Clear welcome message transcription
      setHighlightedWordIndex(-1);
    }).catch((error) => {
      console.error("Error speaking welcome back message:", error);
      console.log('[Index] handleContinueLearning: synthesizeSpeech rejected.');
      // Removed setDannyState('idle') from here
      // Keep currentResponse visible
      setHighlightedWordIndex(-1);
    });
  };

  // Handle input mode change
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'text') {
      stopListening(); // Stop listening if switching to text mode
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserInput(textInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container max-w-4xl mx-auto">
        <ModalsContainer
          showNameModal={showNameModal}
          handleUserNameSubmit={handleUserNameSubmit}
          showWelcomeBackModal={showWelcomeBackModal}
          setShowWelcomeBackModal={setShowWelcomeBackModal}
          handleContinueLearning={handleContinueLearning}
          userName={userName}
          showDocumentationModal={showDocumentationModal}
          setShowDocumentationModal={setShowDocumentationModal}
        />
        
        <HeaderSection
          userContext={userContext}
          onUserContextChange={setUserContext}
          userAvatar={userAvatar}
          userName={userName}
          setShowDocumentationModal={setShowDocumentationModal}
        />

        <ChatInterface
          dannyState={dannyState}
          setDannyState={setDannyState}
          currentTranscript={currentTranscript}
          currentResponse={currentResponse}
          highlightedWordIndex={highlightedWordIndex}
          inputMode={inputMode}
          handleInputModeChange={handleInputModeChange}
          isSupported={isSupported}
          isMicActive={isMicActive}
          startListening={startListening}
          textInput={textInput}
          setTextInput={setTextInput}
          handleTextSubmit={handleTextSubmit}
          messages={messages}
          userAvatar={userAvatar}
          userName={userName}
          synthesizeSpeech={synthesizeSpeech}
          setHighlightedWordIndex={setHighlightedWordIndex}
          stopListening={stopListening}
          isSpeakingStarted={isSpeakingStarted}
          setIsSpeakingStarted={setIsSpeakingStarted}
        />

        {/* Floating button for mobile documentation */}
        <div className="md:hidden fixed bottom-4 right-4">
          <Button
            variant="default"
            size="icon"
            className="rounded-full w-12 h-12 shadow-lg bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowDocumentationModal(true)}
            title="View Documentation"
          >
            <BookOpen className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
