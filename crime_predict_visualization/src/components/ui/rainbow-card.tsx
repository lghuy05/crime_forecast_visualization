"use client";

import React, { useState, useEffect } from 'react';

interface RainbowCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  index: number;
}

export const SimpleRainbowCard: React.FC<RainbowCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gradientAngle, setGradientAngle] = useState(0);

  // Super simple rainbow animation
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (isHovered) {
        setGradientAngle(prev => (prev + 1) % 360);
      }
      animationId = requestAnimationFrame(animate);
    };

    if (isHovered) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered]);

  return (
    <div
      className="relative h-full min-h-[320px] p-0.5 rounded-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Rainbow border - always visible but animated on hover */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(${gradientAngle}deg, 
            #ff0000 0%, 
            #ff9900 20%, 
            #ffff00 40%, 
            #00ff00 60%, 
            #00ffff 80%, 
            #ff00ff 100%)`,
          filter: 'blur(8px)',
        }}
      />

      {/* Main card */}
      <div className="relative h-full bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Icon */}
          <div className="flex items-center gap-6 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-7 w-7 text-white group-hover:text-blue-300 transition-colors duration-300" />
            </div>

            <div className="flex-1">
              <div className="h-0.5 w-full bg-gradient-to-r from-gray-700 via-blue-500/50 to-transparent mb-2" />
              <div className="h-0.5 w-3/4 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          </div>

          {/* Title and description */}
          <div className="flex-1 mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
              {title}
            </h3>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
              {description}
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 mt-auto">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-4" />

            <button className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium flex items-center justify-center gap-3 overflow-hidden group-hover:bg-gradient-to-r group-hover:from-blue-500/20 group-hover:to-purple-500/20 group-hover:border-blue-500/30 group-hover:text-white transition-all duration-300">
              <span>View Research Details</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Also export a default if needed
export default SimpleRainbowCard;
