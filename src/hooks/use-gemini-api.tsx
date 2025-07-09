import { useChat } from '@/hooks/use-chat';
import { useVoiceSettings } from '@/hooks/use-voice-settings';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { geminiApiClient, AllGeminiKeysFailedError } from '../lib/gemini-api-client';

type DannyState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';

interface UseGeminiApiProps {
  setDannyState: React.Dispatch<React.SetStateAction<DannyState>>;
  setCurrentResponse: React.Dispatch<React.SetStateAction<string>>;
  setHighlightedWordIndex: React.Dispatch<React.SetStateAction<number>>;
  userContext: string;
  setIsSpeakingStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGeminiApi = ({ setDannyState, setCurrentResponse, setHighlightedWordIndex, userContext, setIsSpeakingStarted }: UseGeminiApiProps) => {
  const { state: chatState, addMessage } = useChat();
  const { messages, userName } = chatState;
  const { synthesizeSpeech } = useVoiceSettings();
  const { toast } = useToast();

  // Generate personalized welcome message using Gemini
  const generateWelcomeMessage = async (name: string) => {
    try {
      const contextPrompt = userContext ? `\n\nUser context: ${userContext}` : '';
      const systemInstruction = `You are Danny, a friendly, patient, and encouraging AI virtual assistant for students. Danny was developed by Daniel Larry, a masters student at American University of Nigeria, as a thesis project.`;
      const prompt = `Create a brief, personalized welcome message for ${name}. Keep it under 20 words, be very concise and hit the nail on the head. Make it encouraging and mention being ready to help with educational questions.${contextPrompt}`;

      const response = await geminiApiClient.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`, {
        contents: [{ parts: [{ text: prompt }] }],
        system_instruction: {
          parts: [{ text: systemInstruction }]
        }
      });
      
      const data = await response.json();
      const welcomeMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || `Hi ${name}! Ready to learn fun educational things with you, Take the lead, I am listening!`;
      
      return welcomeMessage;
    } catch (error) {
      console.error('Welcome message generation error:', error);
      return `Hello ${name}! Nice to be with you on this wonderful learning adventure, where do you wanna start?`;
    }
  };

  // Handle user input (voice or text)
  const handleUserInput = async (userText: string) => {
    if (!userText.trim()) return;

    addMessage(userText, 'user');
    setDannyState('thinking');
    setHighlightedWordIndex(-1); // Reset highlighting

    try {
      const contextPrompt = userContext ? `\n\nSome context about the user: ${userContext}` : '';
      const systemInstruction = `You are Danny, a friendly, patient, and encouraging AI virtual assistant for students. Danny was developed by Daniel Larry, a masters student at American University of Nigeria, as a thesis project. Your goal is to explain educational topics clearly and very concisely. Keep your answers focused, brief, and hit the nail on the head. If the question is not educational, try to answer but guide the user back to learning topics. If asked who developed or designed you, mention Daniel Larry, a masters student at American University of Nigeria, and that Danny AI is his thesis project.${userName ? ` The user's name is ${userName}. Address them by name occasionally, but not in every single message.` : ''}${contextPrompt}`;

      const history = messages.map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }],
      }));

      const contents = [...history, { role: 'user', parts: [{ text: userText }] }];

      console.log('[API Call] Sending to Gemini:', { contents, systemInstruction });

      const response = await geminiApiClient.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`, {
        contents: contents,
        system_instruction: {
          parts: [{ text: systemInstruction }]
        }
      });

      const data = await response.json();
      const dannyResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that question. Could you try asking it differently?";

      addMessage(dannyResponse, 'ai');
      setCurrentResponse(dannyResponse);
      setIsSpeakingStarted(true); // Set to true immediately before speech starts
      await synthesizeSpeech(dannyResponse, undefined, false, (word: string, index: number) => {
        setHighlightedWordIndex(index);
      }, () => {
        console.log('[useGeminiApi] handleUserInput: onSpeechStartCallback triggered.');
        setDannyState('speaking');
        // Note: isSpeakingStarted is managed in Index.tsx, this log confirms the callback is fired.
      }, () => {
        console.log('[useGeminiApi] handleUserInput: onSpeechEndCallback triggered. isSpeakingStarted should be false and dannyState to idle.');
        // Note: isSpeakingStarted is managed in Index.tsx, this log confirms the callback is fired.
        setDannyState('idle'); // Set state to idle when speech ends
      });
      setCurrentResponse('');
      setHighlightedWordIndex(-1); // Reset highlighting after speech

    } catch (error) {
      console.log('[useGeminiApi] API Error: Setting dannyState to error_api');
      setDannyState('error_api');
      const isAllKeysError = error instanceof AllGeminiKeysFailedError;
      const errorMessage = isAllKeysError
        ? "I'm sorry, all available connections are currently busy. Please try again in a few minutes."
        : "Hmm, I'm having a little trouble connecting right now. Please try again in a moment.";

      console.log('[useGeminiApi] API Error: Setting currentResponse to error message');
      setCurrentResponse(errorMessage); // Display error message
      await synthesizeSpeech(errorMessage, undefined, true, (word: string, index: number) => {
        setHighlightedWordIndex(index);
      }, () => {
        console.log('[useGeminiApi] API Error: onSpeechStartCallback triggered. isSpeakingStarted should be true.');
      }, () => {
        console.log('[useGeminiApi] API Error: onSpeechEndCallback triggered. isSpeakingStarted should be false and dannyState to idle.');
        setDannyState('idle'); // Set state to idle when speech ends after error message
      }); // Wait for error message to be spoken
      setCurrentResponse(''); // Clear error message transcription
      toast({
        title: isAllKeysError ? "All Connections Busy" : "Connection Problem",
        description: isAllKeysError
          ? "All Gemini API keys are currently failing. Please check your keys and network."
          : "The AI service is experiencing issues. Please try again in a moment!",
        variant: "destructive"
      });
      setHighlightedWordIndex(-1); // Reset highlighting after speech
    }
  };

  return {
    generateWelcomeMessage,
    handleUserInput,
  };
};
