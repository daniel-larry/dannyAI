
import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';

// 1. Define the shape of our state and actions
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatState {
  messages: Message[];
  userName: string | null;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'LOAD_STATE'; payload: ChatState };

// 2. Create the Context
interface ChatContextProps {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  addMessage: (text: string, sender: 'user' | 'ai') => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// 3. Create the Reducer function to manage state updates
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

// 4. Create the Provider Component
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, {
    messages: [],
    userName: null,
  });

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('chatState');
      if (savedState) {
        const parsedState: ChatState = JSON.parse(savedState);
        // Add a welcome message if starting a new session
        const initialState: ChatState = {
            ...parsedState,
            messages: [
                {
                    id: 'welcome-message',
                    text: `Hello ${parsedState.userName || 'there'}! How can I help you today?`,
                    sender: 'ai',
                },
            ],
        };
        dispatch({ type: 'LOAD_STATE', payload: initialState });
      }
    } catch (error) {
      console.error("Failed to parse chat state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chatState', JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save chat state to localStorage", error);
    }
  }, [state]);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: new Date().toISOString(),
      text,
      sender,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  return (
    <ChatContext.Provider value={{ state, dispatch, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

// 5. Create a custom hook for easy context access
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
