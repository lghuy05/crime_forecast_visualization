"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
      } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full text-blue-500/10"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface BackgroundPathsProps {
  onComplete?: () => void;
  duration?: number;
}

export function BackgroundPaths({
  onComplete,
  duration = 3500
}: BackgroundPathsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + 1, 100);
      });
    }, duration / 100);

    // Exit animation after duration
    const exitTimeout = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(exitTimeout);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Animated paths background */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">

        {/* "Welcome to CSAIL" text animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-center tracking-tighter">
            {/* "Welcome" */}
            <span className="inline-block mr-4">
              {"Welcome".split("").map((letter, index) => (
                <motion.span
                  key={`welcome-${index}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  className="inline-block text-transparent bg-clip-text 
                  bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            {/* "to" */}
            <span className="inline-block mr-4">
              {"to".split("").map((letter, index) => (
                <motion.span
                  key={`to-${index}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.4 + index * 0.05,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  className="inline-block text-white/90"
                >
                  {letter}
                </motion.span>
              ))}
            </span>

            {/* "CSAIL" */}
            <span className="inline-block">
              {"CSAIL".split("").map((letter, index) => (
                <motion.span
                  key={`csail-${index}`}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.6 + index * 0.05,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  className="inline-block text-transparent bg-clip-text 
                  bg-gradient-to-r from-purple-400 to-blue-400"
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-lg md:text-xl text-gray-400 tracking-widest text-center mt-4"
          >
            CRIME FORECASTING LAB
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 md:w-80">
          <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: duration / 1000 }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          <div className="text-center text-gray-500 text-sm font-mono">
            {progress}%
          </div>
        </div>

        {/* Loading message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-gray-400 text-sm text-center max-w-md mt-8"
        >
          Loading crime forecasting algorithms...
        </motion.div>
      </div>
    </div>
  );
}
