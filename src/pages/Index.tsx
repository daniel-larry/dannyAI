import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Type, Menu, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import AnimatedAssistant from '@/components/AnimatedAssistant';
import AccessibilitySettings from '@/components/AccessibilitySettings';
import UserNameModal from '@/components/UserNameModal';
import ProfileSettings from '@/components/ProfileSettings';
import UserAvatar from '@/components/UserAvatar';
import { useChat } from '@/hooks/use-chat';
import DocumentationModal from '@/components/DocumentationModal';

// Hardcoded Gemini API key
const GEMINI_API_KEY = "AIzaSyAA8629AAGPJL0A_w0S-kdb_CiRUxot9vg";

// Define proper TypeScript interfaces for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  addEventListener(type: 'start', listener: (event: Event) => void): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'end', listener: (event: Event) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
    responsiveVoice: {
      speak: (text: string, voice?: string, parameters?: {
        pitch?: number;
        rate?: number;
        volume?: number;
        onstart?: () => void;
        onend?: () => void;
      }) => void;
      cancel: () => void;
      voiceSupport: () => boolean;
      isPlaying: () => boolean;
      pause: () => void;
      resume: () => void;
    };
  }
}

// Define Danny's states
type DannyState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';
type InputMode = 'voice' | 'text';

const Index = () => {
  const { state: chatState, dispatch, addMessage } = useChat();
  const { messages, userName } = chatState;

  const [dannyState, setDannyState] = useState<DannyState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [textInput, setTextInput] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [currentResponse, setCurrentResponse] = useState('');
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const [isMicActive, setIsMicActive] = useState(false);
  
  // Accessibility settings
  const [speechRate, setSpeechRate] = useState(1.2);
  const [speechVolume, setSpeechVolume] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState('UK English Female');
  
  // User settings
  const [userAvatar, setUserAvatar] = useState<string>('cat1');
  const [userContext, setUserContext] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listeningToThinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noSpeechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const { toast } = useToast();

  // Load user preferences from localStorage
  useEffect(() => {
    const savedUserAvatar = localStorage.getItem('danny-user-avatar');
    const savedUserContext = localStorage.getItem('danny-user-context');
    const savedSpeechRate = localStorage.getItem('danny-speech-rate');
    const savedSpeechVolume = localStorage.getItem('danny-speech-volume');
    const savedSelectedVoice = localStorage.getItem('danny-selected-voice');
    
    if (userName && savedUserAvatar) {
      setUserAvatar(savedUserAvatar);
    } else if (!userName) {
      setShowNameModal(true);
    }
    
    if (savedUserContext) {
      setUserContext(savedUserContext);
    }
    
    if (savedSpeechRate) {
      setSpeechRate(parseFloat(savedSpeechRate));
    }
    
    if (savedSpeechVolume) {
      setSpeechVolume(parseFloat(savedSpeechVolume));
    }
    
    if (savedSelectedVoice) {
      setSelectedVoice(savedSelectedVoice);
    }
  }, [userName]);

  // Check browser support and initialize on load
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      const errorMessage = "Your browser doesn't support voice input, but you can still type your questions!";
      speakText(errorMessage);
      toast({
        title: "Voice Input Not Supported",
        description: errorMessage,
        variant: "destructive"
      });
      setInputMode('text');
    }
  }, [toast]);

  // Generate personalized welcome message using Gemini
  const generateWelcomeMessage = async (name: string) => {
    try {
      const contextPrompt = userContext ? `\n\nUser context: ${userContext}` : '';
      const systemInstruction = `You are Danny, a friendly, patient, and encouraging AI virtual assistant for students. Danny was developed by Daniel Larry, a masters student at American University of Nigeria, as a thesis project.`;
      const prompt = `Create a brief, personalized welcome message for ${name}. Keep it under 20 words, be very concise and hit the nail on the head. Make it encouraging and mention being ready to help with educational questions.${contextPrompt}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: {
            parts: [{ text: systemInstruction }]
          }
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      const welcomeMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || `Hi ${name}! Ready to learn fun educational things with you, Take the lead, I am listening!`;
      
      return welcomeMessage;
    } catch (error) {
      console.error('Welcome message generation error:', error);
      return `Hello ${name}! Nice to be with you on this wonderful learning adventure, where do you wanna start?`;
    }
  };

  // Handle user name and avatar submission
  const handleUserNameSubmit = async (name: string, avatar: string) => {
    dispatch({ type: 'SET_USER_NAME', payload: name });
    setUserAvatar(avatar);
    localStorage.setItem('danny-user-avatar', avatar);
    setShowNameModal(false);
    
    if (inputMode === 'voice') {
      setDannyState('thinking');
      const welcomeMessage = await generateWelcomeMessage(name);
      speakText(welcomeMessage);
    }
    setHasWelcomed(true);
  };

  // Speak text using ResponsiveVoice
  const speakText = (text: string) => {
    if (!text.trim()) return;
    
    setDannyState('speaking');
    setCurrentResponse(text);
    
    if (window.responsiveVoice) {
      window.responsiveVoice.cancel();
      window.responsiveVoice.speak(text, selectedVoice, {
        rate: speechRate,
        pitch: 1,
        volume: speechVolume,
        onend: () => {
          setDannyState('idle');
          setCurrentResponse('');
        }
      });
    } else {
      console.error('ResponsiveVoice not available');
      setDannyState('idle');
      setCurrentResponse('');
    }
  };

  // Handle accessibility setting changes
  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate);
    localStorage.setItem('danny-speech-rate', rate.toString());
  };

  const handleSpeechVolumeChange = (volume: number) => {
    setSpeechVolume(volume);
    localStorage.setItem('danny-speech-volume', volume.toString());
  };

  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    localStorage.setItem('danny-selected-voice', voice);
  };

  // Handle input mode change
  const handleInputModeChange = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'text' && recognitionRef.current) {
      recognitionRef.current.stop();
      setDannyState('idle');
    } else if (mode === 'voice' && userName && !hasWelcomed) {
      setTimeout(async () => {
        setDannyState('thinking');
        const welcomeMessage = await generateWelcomeMessage(userName);
        speakText(welcomeMessage);
        setHasWelcomed(true);
      }, 500);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setDannyState('idle');
    }
  };

  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.addEventListener('start', () => {
      setDannyState('listening');
      finalTranscriptRef.current = '';
      setCurrentTranscript('');
      if (listeningToThinkingTimeoutRef.current) clearTimeout(listeningToThinkingTimeoutRef.current);
      if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
      // Start timer to switch to thinking state after 3 seconds of listening
      listeningToThinkingTimeoutRef.current = setTimeout(() => {
        setDannyState('thinking');
      }, 3000);
      // Start no speech timeout
      noSpeechTimeoutRef.current = setTimeout(() => {
        recognition.stop();
        const errorMessage = "I didn't hear anything. Please try speaking when the microphone is active!";
        speakText(errorMessage);
        toast({
          title: "No Speech Detected",
          description: errorMessage,
          variant: "destructive",
        });
      }, 5000); // 5 seconds timeout for no speech
    });

    recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
      if (speechEndTimeoutRef.current) clearTimeout(speechEndTimeoutRef.current);
      if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current); // Clear no speech timeout on result

      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      setCurrentTranscript(finalTranscriptRef.current + interimTranscript);

      // Restart no speech timeout on result
      noSpeechTimeoutRef.current = setTimeout(() => {
        recognition.stop();
        const errorMessage = "I stopped listening because I didn't hear anything for a while. Feel free to try again!";
        speakText(errorMessage);
        toast({
          title: "No Further Speech Detected",
          description: errorMessage,
          variant: "destructive",
        });
      }, 5000); // 5 seconds timeout for no further speech

      speechEndTimeoutRef.current = setTimeout(() => {
        const finalTranscript = finalTranscriptRef.current.trim();
        if (finalTranscript) {
          recognition.stop();
          handleUserInput(finalTranscript);
        }
      }, 1500);
    });

    recognition.addEventListener('end', () => {
      if (speechEndTimeoutRef.current) clearTimeout(speechEndTimeoutRef.current);
      if (listeningToThinkingTimeoutRef.current) clearTimeout(listeningToThinkingTimeoutRef.current);
      if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
      setIsMicActive(false);
      setDannyState('idle');
    });

    recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
      if (speechEndTimeoutRef.current) clearTimeout(speechEndTimeoutRef.current);
      setDannyState('error_speech_recognition');
      const errorMessage = "Oops, something went wrong! I couldn't quite catch that. Please try speaking a bit louder or closer to the microphone.";
      speakText(errorMessage);
      toast({
        title: "Oops, something went wrong!",
        description: "I couldn't quite catch that. Please try speaking a bit louder or closer to the microphone.",
        variant: "destructive",
      });
      setTimeout(() => {
        setDannyState('idle');
      }, 5000);
    });

    return recognition;
  };

  // Handle user input (voice or text)
  const handleUserInput = async (userText: string) => {
    if (!userText.trim()) return;

    addMessage(userText, 'user');
    setDannyState('thinking');
    setCurrentTranscript('');
    setTextInput('');

    try {
      const contextPrompt = userContext ? `\n\nSome context about the user: ${userContext}` : '';
      const systemInstruction = `You are Danny, a friendly, patient, and encouraging AI virtual assistant for students. Danny was developed by Daniel Larry, a masters student at American University of Nigeria, as a thesis project. Your goal is to explain educational topics clearly and very concisely. Keep your answers focused, brief, and hit the nail on the head. If the question is not educational, politely decline and guide the user back to learning topics. If asked who developed or designed you, mention Daniel Larry, a masters student at American University of Nigeria, and that Danny AI is his thesis project.${userName ? ` The user's name is ${userName}. Address them by name occasionally, but not in every single message.` : ''}${contextPrompt}`;

      const history = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const contents = [...history, { role: 'user', parts: [{ text: userText }] }];

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          system_instruction: {
            parts: [{ text: systemInstruction }]
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error Response:', errorBody);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const dannyResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that question. Could you try asking it differently?";

      addMessage(dannyResponse, 'ai');
      speakText(dannyResponse);

    } catch (error) {
      console.error('API Error:', error);
      setDannyState('error_api');
      const errorMessage = "Hmm, I'm having a little trouble connecting right now. Please try again in a moment.";
      speakText(errorMessage);
      toast({
        title: "Connection Problem",
        description: "The AI service is overcrowded at the moment. Please try again in a moment!",
        variant: "destructive"
      });
      setTimeout(() => {
        setDannyState('idle');
      }, 5000);
      if (inputMode === 'voice') {
        speakText(errorMessage);
      }
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && dannyState === 'idle') {
      handleUserInput(textInput.trim());
    }
  };

  // Start listening
  const startListening = () => {
    if (!isSupported || (window.responsiveVoice && window.responsiveVoice.isPlaying())) return;

    if (recognitionRef.current && isMicActive) {
      recognitionRef.current.stop();
      setIsMicActive(false);
      setDannyState('idle');
      return;
    }

    const recognition = initializeSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.start();
    setIsMicActive(true);
  };

  // Get status text
  const getStatusText = () => {
    switch (dannyState) {
      case 'listening': return 'Listening...';
      case 'thinking': return 'Danny is thinking...';
      case 'speaking': return 'Danny is speaking...';
      default:
        return userName 
          ? `Hi ${userName}! Ask me an educational question.`
          : "Hi! I'm Danny. Let's get started.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="container max-w-4xl mx-auto">
        
        <UserNameModal isOpen={showNameModal} onSubmit={handleUserNameSubmit} />
        <DocumentationModal isOpen={showDocumentationModal} onOpenChange={setShowDocumentationModal} />
        
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-between mb-2">
            <div className="hidden md:block w-16"></div> {/* Placeholder for alignment on desktop */}
            <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">Danny: Your Learning Assistant</h1>
            <div className="hidden md:flex items-center space-x-2">
              <AccessibilitySettings
                speechRate={speechRate}
                speechVolume={speechVolume}
                selectedVoice={selectedVoice}
                onSpeechRateChange={handleSpeechRateChange}
                onSpeechVolumeChange={handleSpeechVolumeChange}
                onVoiceChange={handleVoiceChange}
              />
              
              
              <ProfileSettings userContext={userContext} onUserContextChange={setUserContext} userAvatar={userAvatar} userName={userName} />
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
                    <AccessibilitySettings
                      speechRate={speechRate}
                      speechVolume={speechVolume}
                      selectedVoice={selectedVoice}
                      onSpeechRateChange={handleSpeechRateChange}
                      onSpeechVolumeChange={handleSpeechVolumeChange}
                      onVoiceChange={handleVoiceChange}
                    />
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      title="View Documentation"
                      onClick={() => setShowDocumentationModal(true)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" /> Documentation
                    </Button>
                    <ProfileSettings userContext={userContext} onUserContextChange={setUserContext} userAvatar={userAvatar} userName={userName} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <p className="text-gray-600">Voice-powered AI assistant for educational support</p>
        </div>

        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <AnimatedAssistant state={dannyState} />
            <p className="text-lg font-medium text-gray-700 mt-4">{getStatusText()}</p>
          </div>
          
          <div className="mb-6">
            {currentTranscript && (
              <p className="text-sm text-gray-600 mt-2 p-3 bg-white rounded-lg shadow-sm border">
                🎤 "{currentTranscript}"
              </p>
            )}
            {currentResponse && dannyState === 'speaking' && (
              <div className="text-sm text-gray-700 mt-2 p-3 bg-yellow-50 rounded-lg shadow-sm border">
                {currentResponse}
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
                disabled={!isSupported || dannyState === 'speaking' || dannyState === 'thinking' || dannyState === 'listening'}
                size="lg"
                title={(() => {
                  if (dannyState === 'speaking') return "Danny is speaking...";
                  if (dannyState === 'thinking') return "Danny is thinking...";
                  if (dannyState === 'listening') return "Listening...";
                  return isMicActive ? "Stop Listening" : "Start Listening";
                })()}
                variant={(() => {
                  if (dannyState === 'listening') return "recording";
                  if (dannyState === 'speaking' || dannyState === 'thinking') return "ghost";
                  return isMicActive ? "recording" : "default";
                })()}
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

        {messages.length > 1 && (
          <Card className="p-6 bg-white/80">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversation</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.slice(1).map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl ${entry.sender === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}
                  onClick={() => entry.sender === 'ai' && speakText(entry.text)}
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
