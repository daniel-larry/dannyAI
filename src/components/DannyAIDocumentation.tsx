import React, { useEffect } from 'react';
import { ExternalLink, Github, Heart, Star, GitFork, Mic, Volume2, Eye, Keyboard, Settings, Users, FileText, Lightbulb, Palette } from 'lucide-react';

const DannyAIDocumentation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).mermaid) {
        (window as any).mermaid.initialize({ startOnLoad: true });
        (window as any).mermaid.run();
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🤖 Danny AI: Your Educational Voice Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              by Daniel Larry
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
              <GitFork className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          🎓 Danny is an AI-powered voice assistant specifically designed for educational support. Built with React, TypeScript, and modern web APIs, Danny AI provides an interactive learning experience through voice conversations.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            ⚛️ React
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
            📘 TypeScript
          </span>
          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium">
            🎨 Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            ♿ Accessibility First
          </span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm font-medium">
            🎤 Voice Powered
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://github.com/daniel-larry/dannyAI" 
            className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            View on GitHub
          </a>
          
          <a 
            href="https://huggingface.co/dannylarry/spaces" 
            className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.66,0A2.66,2.66,0,0,0,0,2.66V21.34A2.66,2.66,0,0,0,2.66,24H21.34A2.66,2.66,0,0,0,24,21.34V2.66A2.66,2.66,0,0,0,21.34,0ZM18.09,15.17a1.3,1.3,0,0,1-1.8,0l-2.1-2.1-2.1,2.1a1.3,1.3,0,1,1-1.8-1.8l2.1-2.1-2.1-2.1a1.3,1.3,0,1,1,1.8-1.8l2.1,2.1,2.1-2.1a1.3,1.3,0,1,1,1.8,1.8l-2.1,2.1,2.1,2.1a1.3,1.3,0,0,1,0,1.8Z"></path>
            </svg>
            Try on Hugging Face
          </a>
          
          <a 
            href="https://daniellarry.netlify.app" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Portfolio
          </a>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">📋 Table of Contents</h2>
        <nav className="space-y-1">
          <a href="#executive-summary" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"><FileText className="w-4 h-4 mr-2" />Executive Summary</a>
          <a href="#problem-statement" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"><Lightbulb className="w-4 h-4 mr-2" />Problem Statement</a>
          <a href="#user-personas" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"><Users className="w-4 h-4 mr-2" />User Personas & Journeys</a>
          <a href="#key-features" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm"><Palette className="w-4 h-4 mr-2" />Key Features</a>
          <a href="#accessibility" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">♿ Accessibility Features</a>
          <a href="#setup" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">⚙️ Setup Instructions</a>
          <a href="#browser-requirements" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">🌐 Browser Requirements</a>
          <a href="#usage" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">🚀 How to Use</a>
          <a href="#tech-stack" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">🛠️ Technical Architecture</a>
          <a href="#educational-focus" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">🎓 Educational Focus</a>
          <a href="#development" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">👨‍💻 Development</a>
          <a href="#troubleshooting" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm">🔧 Troubleshooting</a>
        </nav>
      </div>

      {/* Executive Summary */}
      <section id="executive-summary" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          <FileText className="w-6 h-6 mr-3 text-blue-500" />
          Executive Summary
        </h2>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 mb-2"><strong>Purpose:</strong> To create an educational tool that leverages a voice-first user interface to make learning more accessible, engaging, and interactive for students of all abilities.</p>
          <p className="text-blue-800 dark:text-blue-200"><strong>Key Differentiator:</strong> DannyAI's core strength is its focus on conversational UI and accessibility, providing a seamless learning experience that prioritizes natural language interaction over traditional GUIs.</p>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem-statement" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
          Problem Statement: The UI/UX Challenge
        </h2>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">Current Learning Gaps:</h3>
          <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
            <li>• Traditional educational platforms can be visually cluttered and intimidating for new users.</li>
            <li>• Lack of intuitive, hands-free learning options for students who are multitasking or have motor impairments.</li>
            <li>• Text-heavy interfaces fail to engage auditory and kinesthetic learners effectively.</li>
          </ul>
        </div>
      </section>

      {/* User Personas & Journeys */}
      <section id="user-personas" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          <Users className="w-6 h-6 mr-3 text-green-500" />
          User-Centric Design
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">The Inquisitive Student</h3>
            <p className="text-green-800 dark:text-green-200 text-sm"><strong>Pain Points:</strong> Feels overwhelmed by dense textbooks; wants quick, digestible answers.</p>
            <p className="text-green-800 dark:text-green-200 text-sm"><strong>UI Solution:</strong> A simple, conversational flow where asking a question and getting an answer is the primary interaction.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">The Accessibility Advocate</h3>
            <p className="text-purple-800 dark:text-purple-200 text-sm"><strong>Pain Points:</strong> Finds most web apps difficult to navigate without a screen reader or keyboard.</p>
            <p className="text-purple-800 dark:text-purple-200 text-sm"><strong>UI Solution:</strong> Full keyboard navigation, ARIA-compliant design, and a voice-first approach that minimizes reliance on visual cues.</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="key-features" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          <Palette className="w-6 h-6 mr-3 text-indigo-500" />
          UI & Feature Highlights
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Core UI Features</h3>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
              <li>Minimalist, single-orb interaction point.</li>
              <li>State-driven visual feedback (color changes).</li>
              <li>Clear, legible typography for chat history.</li>
              <li>Accessible settings and documentation modals.</li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3 text-green-900 dark:text-green-100">Future UI Enhancements</h3>
            <ul className="list-disc list-inside text-green-800 dark:text-green-200 space-y-1">
              <li>Thematic customization (light/dark/high-contrast).</li>
              <li>Interactive transcripts with clickable words.</li>
              <li>Gamification elements (progress bars, badges).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility Features Section */}
      <section id="accessibility" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          ♿ Accessibility Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Mic className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Voice Recognition</h3>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">Real-time speech-to-text using Web Speech API</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-2">
              <Volume2 className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Text-to-Speech</h3>
            </div>
            <p className="text-green-800 dark:text-green-200 text-sm">Natural voice responses with word-by-word highlighting</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center mb-2">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Visual Feedback</h3>
            </div>
            <p className="text-purple-800 dark:text-purple-200 text-sm">Dynamic orb that reflects Danny's current state</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center mb-2">
              <Keyboard className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Keyboard Navigation</h3>
            </div>
            <p className="text-orange-800 dark:text-orange-200 text-sm">Full keyboard accessibility for all interactive elements.</p>
          </div>
        </div>
        
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">🧠 AI-Powered Features:</h4>
          <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
            <li>• Educational Q&A powered by Google Gemini</li>
            <li>• Conversation History tracking</li>
            <li>• Graceful error handling for speech recognition and API errors</li>
          </ul>
        </div>
      </section>

      {/* Setup Instructions */}
      <section id="setup" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⚙️ Setup Instructions</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">1️⃣ Install Dependencies</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
              npm install
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">2️⃣ Environment Setup</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Create a <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> file in the root (you can copy <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.example</code>) and add your Gemini API key:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
              VITE_GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">3️⃣ Run the Development Server</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono mb-2">
              npm run dev
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">The application will be available at <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">http://localhost:8080</code></p>
          </div>
        </div>
      </section>

      {/* Browser Requirements */}
      <section id="browser-requirements" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🌐 Browser Requirements</h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 mb-3">Danny requires a modern browser with Web Speech API support:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">✅ Recommended:</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• Chrome (best experience)</li>
                <li>• Edge (excellent support)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ Limited Support:</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• Safari (partial features)</li>
                <li>• Firefox (basic support)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section id="usage" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🚀 How to Use</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">👋 Personalized Onboarding</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">On your first visit, you'll be prompted to enter your name and choose an avatar and voice preference. On subsequent visits, Danny will welcome you back.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">🗣️ Choose Your Input Mode</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">You can switch between <strong>Voice</strong> and <strong>Text</strong> input modes using the toggle buttons.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">❓ Ask Questions</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">In <strong>Voice mode</strong>, click the central orb to start speaking. In <strong>Text mode</strong>, type your question in the input field and press Enter.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">🔊 Listen & Read Responses</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Danny will respond with voice and a written transcript. The words will be highlighted as they are spoken.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">👁️ Visual Feedback</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">The animated avatar and the central orb's color indicate Danny's current state:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Idle: Ready to listen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Listening: Recording your voice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Thinking: Processing your question</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Speaking: Delivering the response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🛠️ Technical Architecture</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Core Technologies</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  <strong>Frontend:</strong> React, TypeScript, Vite
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  <strong>Styling:</strong> Tailwind CSS with shadcn/ui
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  <strong>State Management:</strong> Zustand & React Hooks
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  <strong>Client-side Storage:</strong> Dexie.js (IndexedDB)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">APIs & Services</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  <strong>AI:</strong> Google Gemini API
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  <strong>Speech Recognition:</strong> Web Speech API
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  <strong>Speech Synthesis:</strong> Web Speech API
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Component & Hook Architecture</h3>
            <div className="mermaid bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
              {`
graph TD
    A[pages/Index.tsx] --> B{HeaderSection};
    A --> C{ChatInterface};
    A --> D{ModalsContainer};

    subgraph "Custom Hooks"
        H1[useChat]
        H2[useGeminiApi]
        H3[useSpeechRecognition]
        H4[useVoiceSettings]
    end

    A --> H1;
    A --> H2;
    A --> H3;
    A --> H4;

    C --> H1;
    C --> H3;
    C --> H4;

    style A fill:#2563eb,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    style D fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
    style H1 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style H2 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style H3 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style H4 fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
              `}
            </div>
          </div>
        </div>
      </section>

      {/* Educational Focus */}
      <section id="educational-focus" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎓 Educational Focus</h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Danny is designed specifically for educational interactions:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
              <li>• 📚 Explains concepts clearly and concisely</li>
              <li>• 😊 Maintains a patient and encouraging tone</li>
            </ul>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
              <li>• 🎯 Focuses on learning-appropriate content</li>
              <li>• 🔄 Politely redirects to educational topics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Development */}
      <section id="development" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">👨‍💻 Development</h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The project uses modern React patterns with TypeScript for type safety. Key components:
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">src/pages/Index.tsx</code>: The main component orchestrating the application state and UI.
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">src/hooks/</code>: Custom hooks for managing chat, speech, voice, and API logic.
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">src/components/</code>: Reusable UI components for the chat interface, modals, and settings.
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm">src/lib/dexie.ts</code>: Client-side database setup for persisting chat history.
            </li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🔧 Troubleshooting</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">🎤 Microphone Issues</h3>
            <p className="text-red-800 dark:text-red-200 text-sm">Ensure your browser has microphone permissions enabled.</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🔑 API Errors</h3>
            <p className="text-orange-800 dark:text-orange-200 text-sm">Verify your Gemini API key is correctly set in the .env.local file.</p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">🗣️ Speech Recognition</h3>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">Make sure you're using a supported browser and speaking clearly.</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🔊 No Audio Output</h3>
            <p className="text-purple-800 dark:text-purple-200 text-sm">Check your system volume and browser audio settings.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-gray-600 dark:text-gray-400">
              UI & Software Design by 
            </p>
            <a 
              href="https://daniellarry.netlify.app" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Daniel Larry
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            🎓 American University of Nigeria • June 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DannyAIDocumentation;
