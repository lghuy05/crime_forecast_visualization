"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface EnhancedRainbowCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick?: () => void;
  index: number;
}

export const EnhancedRainbowCard: React.FC<EnhancedRainbowCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Set consistent min-height
  const cardHeight = 380;

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Initial animation - stagger based on index
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out'
      });

      // Animate icon on mount
      gsap.from(iconRef.current, {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        delay: index * 0.15 + 0.3,
        ease: 'back.out(1.7)'
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleMouseEnter = () => {
    if (!cardRef.current || !contentRef.current || !borderRef.current) return;

    // Kill any existing animations
    gsap.killTweensOf([cardRef.current, contentRef.current, borderRef.current, iconRef.current]);

    // Card hover animation - lift and scale
    gsap.to(cardRef.current, {
      y: -15,
      scale: 1.05,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Rainbow border animation - ensure it's visible and animating
    gsap.to(borderRef.current, {
      opacity: 1,
      backgroundPosition: '200% 0%',
      duration: 1.5,
      ease: 'none',
      repeat: -1
    });

    // Icon animation
    gsap.to(iconRef.current, {
      scale: 1.2,
      rotation: 15,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });

    // Glow effect
    gsap.to(cardRef.current, {
      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 60px rgba(139, 92, 246, 0.15)',
      duration: 0.4
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !contentRef.current || !borderRef.current) return;

    // Kill animations
    gsap.killTweensOf([cardRef.current, contentRef.current, borderRef.current, iconRef.current]);

    // Reset animations
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(borderRef.current, {
      opacity: 0,
      backgroundPosition: '0% 0%',
      duration: 0.5
    });

    gsap.to(iconRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className="relative group h-full"
      style={{ minHeight: `${cardHeight}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Rainbow border - hidden by default, shows on hover */}
      <div
        ref={borderRef}
        className="absolute -inset-0.5 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #ff00ff, #ff0000)',
          backgroundSize: '200% 100%',
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />

      {/* Main card with consistent height */}
      <div
        className="relative h-full bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-between border border-gray-800 group-hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
        style={{ minHeight: `${cardHeight - 40}px` }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div ref={contentRef} className="relative z-10 flex-1 flex flex-col">
          {/* Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div
              ref={iconRef}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300"
            >
              <Icon className="h-6 w-6 text-white group-hover:text-blue-300 transition-colors duration-300" />
            </div>

            {/* Animated line */}
            <div className="flex-1 relative h-px overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-blue-500/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <div className="flex-1 mb-6">
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-100 transition-colors duration-300 line-clamp-4">
              {description}
            </p>
          </div>

          {/* Button */}
          <div className="relative z-10 mt-auto">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700/30 to-transparent mb-4" />

            <button className="w-full py-3 px-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 overflow-hidden group-hover:scale-[1.02] group-hover:bg-gradient-to-r group-hover:from-blue-500/10 group-hover:to-purple-500/10 group-hover:border-blue-500/30 group-hover:text-white transition-all duration-300">
              <span>View Research Details</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
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
