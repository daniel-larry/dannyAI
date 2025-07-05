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

  // Helper to clear all timeouts
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
      clearAllTimeouts(); // Clear all timeouts on start

      // Start timer to switch to thinking state after 3 seconds of listening
      listeningToThinkingTimeoutRef.current = setTimeout(() => {
        setDannyState('thinking');
      }, 3000);

      // Start no speech timeout for initial silence
      noSpeechTimeoutRef.current = setTimeout(() => {
        recognition.stop();
        const errorMessage = "I didn't hear anything. Please try speaking when the microphone is active!";
        setCurrentResponse(errorMessage);
        setIsSpeakingStarted(true);
        synthesizeSpeech(errorMessage, undefined, false, (word: string, index: number) => {}, () => {}, () => {
          setCurrentResponse('');
          setIsSpeakingStarted(false);
        });
        toast({
          title: "No Speech Detected",
          description: errorMessage,
          variant: "destructive",
        });
      }, 5000); // 5 seconds timeout for no speech at all
    });

    recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
      console.log('[Speech Recognition] Result event fired.', event);
      clearAllTimeouts(); // Clear all timeouts on any result

      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      const newCurrentTranscript = finalTranscriptRef.current + interimTranscript;
      setCurrentTranscript(newCurrentTranscript);
      console.log(`[Speech Recognition] Interim: "${interimTranscript}", Final Ref: "${finalTranscriptRef.current}", Current State: "${newCurrentTranscript}"`);

      // Set timeout to process final transcript after a pause
      speechEndTimeoutRef.current = setTimeout(() => {
        const finalTranscript = finalTranscriptRef.current.trim();
        if (finalTranscript) {
          recognition.stop(); // Stop recognition to trigger 'end' event
          handleUserInput(finalTranscript);
          setCurrentTranscript(''); // Clear the transcript after processing
        }
      }, 3000); // 3 seconds of silence to consider phrase ended

      // Reset no speech timeout for prolonged silence after speech
      noSpeechTimeoutRef.current = setTimeout(() => {
        recognition.stop();
        const errorMessage = "I stopped listening because I didn't hear anything for a while. Feel free to try again!";
        setCurrentResponse(errorMessage);
        setIsSpeakingStarted(true);
        synthesizeSpeech(errorMessage, undefined, false, (word: string, index: number) => {}, () => {}, () => {
          setCurrentResponse('');
          setIsSpeakingStarted(false);
        });
        toast({
          title: "No Further Speech Detected",
          description: errorMessage,
          variant: "destructive",
        });
      }, 5000); // 5 seconds timeout for no further speech
    });

    recognition.addEventListener('end', () => {
      console.log(`[Speech Recognition] End event fired. Final Transcript Ref: "${finalTranscriptRef.current}", Current Transcript State: "${currentTranscript}"`);
      clearAllTimeouts(); // Clear all timeouts on end
      setIsMicActive(false);
      setDannyState('idle');
      setCurrentTranscript(''); // Clear transcript on end
    });

    recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
      clearAllTimeouts(); // Clear all timeouts on error

      setDannyState('error_speech_recognition');
      const errorMessage = "Oops, something went wrong! I couldn't quite catch that. Please try speaking a bit louder or closer to the microphone.";
      setCurrentResponse(errorMessage);
      setIsSpeakingStarted(true);
      synthesizeSpeech(errorMessage, undefined, false, (word: string, index: number) => {}, () => {}, () => {
        setCurrentResponse('');
        setIsSpeakingStarted(false);
      });
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