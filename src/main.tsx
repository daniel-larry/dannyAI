import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ChatProvider } from './hooks/use-chat'; // Import the ChatProvider
import { VoiceSettingsProvider } from './contexts/VoiceSettingsContext';

createRoot(document.getElementById('root')!).render(
  <VoiceSettingsProvider>
    <ChatProvider>
      <App />
    </ChatProvider>
  </VoiceSettingsProvider>
);
