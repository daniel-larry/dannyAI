import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useVoiceSettings } from '@/hooks/use-voice-settings';

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
  }
}

type DannyState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';

interface UseSpeechRecognitionProps {
  setDannyState: React.Dispatch<React.SetStateAction<DannyState>>;
  handleUserInput: (text: string) => Promise<void>;
  dannyState: DannyState;
  setCurrentResponse: React.Dispatch<React.SetStateAction<string>>;
  setIsSpeakingStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSpeechRecognition = ({ setDannyState, handleUserInput, dannyState, setCurrentResponse, setIsSpeakingStarted }: UseSpeechRecognitionProps) => {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isMicActive, setIsMicActive] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const listeningToThinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noSpeechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const { toast } = useToast();
  const { synthesizeSpeech } = useVoiceSettings();

  const clearAllTimeouts = () => {
    if (speechEndTimeoutRef.current) clearTimeout(speechEndTimeoutRef.current);
    if (listeningToThinkingTimeoutRef.current) clearTimeout(listeningToThinkingTimeoutRef.current);
    if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
  };

  // Check browser support on load
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      const errorMessage = "Your browser doesn't support voice input, but you can still type your questions!";
      setCurrentResponse(errorMessage);
      setIsSpeakingStarted(true);
      synthesizeSpeech(errorMessage, undefined, false, (word: string, index: number) => {}, () => {}, () => {
        setCurrentResponse('');
        setIsSpeakingStarted(false);
      });
      toast({
        title: "Voice Input Not Supported",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast, synthesizeSpeech]);

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
        synthesizeSpeech(errorMessage);
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
        synthesizeSpeech(errorMessage);
        toast({
          title: "No Further Speech Detected",
          description: errorMessage,
          variant: "destructive",
        });
      }, 8000); // 7 seconds timeout for no further speech

      speechEndTimeoutRef.current = setTimeout(() => {
        const finalTranscript = finalTranscriptRef.current.trim();
        if (finalTranscript) {
          recognition.stop();
          handleUserInput(finalTranscript);
        }
      }, 5000);
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
      if (listeningToThinkingTimeoutRef.current) clearTimeout(listeningToThinkingTimeoutRef.current);
      if (noSpeechTimeoutRef.current) clearTimeout(noSpeechTimeoutRef.current);
      setDannyState('error_speech_recognition');
      const errorMessage = "Oops, something went wrong! I couldn't quite catch that. Please try speaking a bit louder or closer to the microphone.";
      synthesizeSpeech(errorMessage);
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

  // Start listening
  const startListening = () => {
    if (!isSupported || dannyState === 'speaking') return;

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

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsMicActive(false);
      setDannyState('idle');
      setCurrentTranscript(''); // Clear transcript on manual stop
      clearAllTimeouts(); // Clear all timeouts on manual stop
    }
  };

  return {
    currentTranscript,
    isSupported,
    isMicActive,
    startListening,
    stopListening,
    setCurrentTranscript,
  };
};