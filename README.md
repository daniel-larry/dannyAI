
# Danny: Your Educational Voice Assistant

Danny is an AI-powered voice assistant specifically designed for educational support. Built with React, TypeScript, and modern web APIs, Danny provides an interactive learning experience through voice conversations.

## Features

- **Voice Recognition**: Real-time speech-to-text using Web Speech API
- **AI-Powered Responses**: Educational Q&A powered by Google Gemini 1.5 Flash
- **Text-to-Speech**: Natural voice responses with word-by-word highlighting
- **Visual Feedback**: Dynamic orb that reflects Danny's current state
- **Auto-Introduction**: Danny introduces himself when the app loads
- **Conversation History**: Track your learning conversations
- **Error Handling**: Graceful handling of speech recognition and API errors

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory and add your Gemini API key:

```
VITE_GEMINI_API_KEY=AIzaSyAhu1f2l3HJ0EUBaNI4wt8Ys9TJmu_ES3w
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Browser Requirements

Danny requires a modern browser with Web Speech API support:
- Chrome (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

**Note**: For the best experience, use Chrome or Edge as they have the most complete Web Speech API implementation.

## How to Use

1. **Auto-Introduction**: Danny will introduce himself when you first load the page
2. **Click to Speak**: Press the blue "Click to Speak" button to start a conversation
3. **Ask Questions**: Speak your educational question clearly
4. **Listen to Responses**: Danny will respond with helpful explanations
5. **Visual Feedback**: Watch the central orb change colors based on Danny's state:
   - Blue (Idle): Ready to listen
   - Green (Listening): Actively listening to your question
   - Purple (Thinking): Processing your question with AI
   - Yellow/Orange (Speaking): Providing a response

## Technical Architecture

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Speech Recognition**: Web Speech API (SpeechRecognition)
- **AI Backend**: Google Gemini 1.5 Flash API
- **Text-to-Speech**: Web Speech Synthesis API
- **State Management**: React hooks

## Educational Focus

Danny is designed specifically for educational interactions:
- Explains concepts clearly and concisely
- Maintains a patient and encouraging tone
- Focuses on learning-appropriate content
- Politely redirects non-educational questions back to learning topics

## Development

The project uses modern React patterns with TypeScript for type safety. Key components:

- `src/pages/Index.tsx`: Main application component
- Web Speech APIs for voice interaction
- Google Gemini API integration for AI responses
- Responsive design with Tailwind CSS

## Troubleshooting

**Microphone Issues**: Ensure your browser has microphone permissions enabled.

**API Errors**: Verify your Gemini API key is correctly set in the `.env.local` file.

**Speech Recognition**: Make sure you're using a supported browser and speaking clearly.

**No Audio Output**: Check your system volume and browser audio settings.
