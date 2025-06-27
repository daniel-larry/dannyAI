import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedAssistantProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking' | 'error_api' | 'error_speech_recognition';
  highlightedWordIndex?: number;
}

const avatarImages: Record<string, string[]> = {
  idle: ['/avatars/idle eyes open.webp', '/avatars/idle eyes close.webp'],
  listening: ['/avatars/listening.webp'],
  thinking: ['/avatars/thinking.webp'],
  speaking: ['/avatars/speaking mouth open.webp'],
  error_api: ['/avatars/idle eyes close.webp'], // Use a specific image for API errors
  error_speech_recognition: ['/avatars/idle eyes close.webp'], // Use a specific image for speech recognition errors
};

const AnimatedAssistant: React.FC<AnimatedAssistantProps> = ({ state, highlightedWordIndex = -1 }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Preload images on component mount
  useEffect(() => {
    Object.values(avatarImages).forEach(imageArray => {
      imageArray.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    });
  }, []);

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleBlink = () => {
      const blinkDuration = Math.random() * 150 + 100; // Blink for 100-250ms
      const nextBlinkDelay = Math.random() * 4000 + 3000; // Next blink in 3-7 seconds

      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, blinkDuration);
      }, nextBlinkDelay);
    };

    if (state === 'idle') {
      scheduleBlink();
    } else {
      setIsBlinking(false); // Ensure not blinking if not idle
      if (blinkTimeout) clearTimeout(blinkTimeout);
    }

    return () => {
      if (blinkTimeout) clearTimeout(blinkTimeout);
    };
  }, [state]);

  const currentAvatarSrc = state === 'idle' && isBlinking
    ? avatarImages.idle[1] // Eyes closed
    : avatarImages[state][0]; // Eyes open or other state image

  const getContainerAnimation = () => {
    if (state.startsWith('error')) return 'shake-animation';
    switch (state) {
      case 'listening':
        return 'scale-110';
      case 'thinking':
        return 'scale-105';
      case 'speaking':
        return 'scale-105';
      default:
        return 'scale-100';
    }
  };

  const getAuraColor = () => {
    if (state.startsWith('error')) return 'from-red-400/30 to-rose-600/30';
    switch (state) {
      case 'listening':
        return 'from-green-400/30 to-emerald-600/30';
      case 'thinking':
        return 'from-purple-400/30 to-violet-600/30';
      case 'speaking':
        return 'from-yellow-400/30 to-orange-600/30';
      default:
        return 'from-blue-400/20 to-cyan-600/20';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Aura */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${getAuraColor()} blur-xl transition-all duration-500`}
        initial={{ scale: 1 }}
        animate={
          state === 'listening' || state === 'thinking' || state === 'speaking'
            ? { scale: [1.5, 1.6, 1.5] }
            : { scale: 1 }
        }
        transition={
          state === 'listening' || state === 'thinking' || state === 'speaking'
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5 }
        }
      />

      {/* Main Character Container */}
      <motion.div
        className={`relative z-10 transition-all duration-500 ${getContainerAnimation()}`}
        initial={{ scale: 1, y: 0 }}
        animate={state === 'idle' ? { scale: [1, 1.02, 1], y: [0, -2, 0] } : { scale: getContainerAnimation().includes('scale') ? parseFloat(getContainerAnimation().split('-')[1]) / 100 : 1, y: 0 }}
        transition={state === 'idle' ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      >
        {/* Avatar Image */}
        <div className="w-64 h-64 rounded-full overflow-hidden">
          <motion.img
            key={state} // Key changes to re-trigger animation on state change
            src={currentAvatarSrc}
            alt="Danny AI Avatar"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Floating Particles for Thinking State */}
        {state === 'thinking' && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-0 left-4 w-2 h-2 bg-purple-400 rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-2 right-6 w-1.5 h-1.5 bg-violet-400 rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-4 left-8 w-1 h-1 bg-purple-300 rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        )}

        {/* Sound Waves for Listening State */}
        {state === 'listening' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-full ml-2 flex space-x-1">
              <motion.div
                className="w-1 bg-green-400 rounded-full"
                initial={{ height: 8 }}
                animate={{ height: [8, 16, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-1 bg-green-400 rounded-full"
                initial={{ height: 8 }}
                animate={{ height: [8, 20, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.div
                className="w-1 bg-green-400 rounded-full"
                initial={{ height: 8 }}
                animate={{ height: [8, 12, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
              <motion.div
                className="w-1 bg-green-400 rounded-full"
                initial={{ height: 8 }}
                animate={{ height: [8, 24, 8] }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Speech Bubbles for Speaking State */}
        {state === 'speaking' && (
          <div className="absolute top-0 right-full mr-4 pointer-events-none">
            <motion.div
              className="bg-white rounded-lg px-3 py-2 shadow-lg relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-xs text-gray-600">...</div>
              <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Interactive Glow Ring */}
      <motion.div
        className={`absolute inset-0 rounded-full border-2 transition-all duration-500`}
        initial={{ scale: 1, borderColor: 'rgba(147, 197, 253, 0.5)' }} // blue-300/50
        animate={{
          scale:
            state === 'listening' || state === 'thinking' || state === 'speaking'
              ? [1.1, 1.2, 1.1]
              : 1,
          borderColor:
            state === 'listening'
              ? 'rgba(74, 222, 128, 0.7)' // green-400/70
              : state === 'thinking'
              ? 'rgba(192, 132, 252, 0.7)' // purple-400/70
              : state === 'speaking'
              ? 'rgba(250, 204, 21, 0.7)' // yellow-400/70
              : 'rgba(147, 197, 253, 0.5)', // blue-300/50
        }}
        transition={
          state === 'listening' || state === 'thinking' || state === 'speaking'
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.5 }
        }
      />
    </div>
  );
};

export default AnimatedAssistant;