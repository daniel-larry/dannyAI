import React from 'react';
import { ExternalLink, Github, Heart, Star, GitFork } from 'lucide-react';

const DannyAIDocumentation = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
             DannyAI
          </h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>23</span>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm">
              <GitFork className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span>5</span>
            </div>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          AI-Powered Language Learning Assistant with Accessibility-First Design
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            React
          </span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
            TypeScript
          </span>
          <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded-full text-sm font-medium">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            Accessibility
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <a 
            href="https://github.com/daniellarry/dannyai" 
            className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            View on GitHub
          </a>
          
          <a 
            href="https://huggingface.co/spaces/daniellarry/dannyai" 
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
            href="https://daniellarry.dev" 
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
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white"> Table of Contents</h2>
        <nav className="space-y-1">
          <a href="#overview" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">Overview</a>
          <a href="#features" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">Features</a>
          <a href="#tech-stack" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">Tech Stack</a>
          <a href="#roadmap" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">Roadmap</a>
          <a href="#contributing" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">Contributing</a>
          <a href="#license" className="block text-blue-600 dark:text-blue-400 hover:underline text-sm">License</a>
        </nav>
      </div>

      {/* Overview Section */}
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          Overview
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            DannyAI is an AI-powered language learning assistant designed by Daniel Larry with an accessibility-first approach, creating an inclusive learning experience that adapts to user needs.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The assistant is animated, interactive, and built to support various user types, including those with visual, cognitive, and motor impairments.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          ✨ Features
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2"> Animated Assistant</h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">Character-based AI representation with visual feedback.</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Accessibility First</h3>
            <ul className="list-disc list-inside text-green-800 dark:text-green-200 text-sm space-y-1">
              <li>High-contrast</li>
              <li>Speech speed controls</li>
              <li>Full keyboard navigation and volume control</li>
              <li>Voice controlled alternative and text for people with disabilities</li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Interactive Learning</h3>
            <p className="text-orange-800 dark:text-orange-200 text-sm">Real-time conversations and dynamic content.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Personalization</h3>
            <p className="text-purple-800 dark:text-purple-200 text-sm">Customizable user profiles and learning paths.</p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          Tech Stack
        </h2>
        <div className="grid md:grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Frontend</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  React.js + TypeScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></span>
                  Tailwind CSS
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  shadcn/ui + Radix
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Development</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Vite
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  ESLint + Prettier
                </li>
              </ul>
            </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
          Roadmap
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Frontend Prototype</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Component-based architecture with accessibility features</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm"></div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Backend Integration</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Connected to a GEMINI language model API for conversational AI</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm"></div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Animations</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Advanced assistant animations based on conversation context</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contributing Section */}
      <section id="contributing" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
           Contributing
        </h2>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            I welcome contributions! Please feel free to submit issues, feature requests, or pull requests.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
               Bug Reports
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
               Feature Requests
            </span>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm">
               Pull Requests
            </span>
          </div>
        </div>
      </section>

      {/* License Section */}
      <section id="license" className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">License</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          <p>
            This project is licensed under the MIT License. See the 
            <a 
              href="https://github.com/daniellarry/dannyai/blob/main/LICENSE" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LICENSE
            </a> file for details.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <p className="text-gray-600 dark:text-gray-400">
              Engineered by 
            </p>
            <a 
              href="https://daniellarry.dev" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Daniel Larry
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            American University of Nigeria • June 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DannyAIDocumentation;
