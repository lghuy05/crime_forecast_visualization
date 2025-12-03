"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface EvervaultCardProps {
  value?: number;
  suffix?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
}

export const EvervaultCard: React.FC<EvervaultCardProps> = ({
  value,
  suffix = "",
  className,
  icon: Icon,
  label,
}) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [randomString, setRandomString] = useState("");
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random string for effect
  useEffect(() => {
    setRandomString(generateRandomString(1500));
  }, []);

  // Intersection observer for counting animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && value !== undefined) {
          setIsInView(true);

          // Start counting animation
          let start = 0;
          const end = value;
          const duration = 2000; // 2 seconds
          const increment = end / (duration / 16); // ~60fps

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.current = e.clientX - rect.left;
    mouseY.current = e.clientY - rect.top;
    setRandomString(generateRandomString(1500));
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-all duration-300",
        className
      )}
      onMouseMove={onMouseMove}
    >
      {/* Background pattern effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          maskImage: `radial-gradient(250px at ${mouseX.current}px ${mouseY.current}px, white, transparent)`,
          WebkitMaskImage: `radial-gradient(250px at ${mouseX.current}px ${mouseY.current}px, white, transparent)`,
        }}
      />

      {/* Random text overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay group-hover:opacity-100 transition-opacity duration-500"
        style={{
          maskImage: `radial-gradient(250px at ${mouseX.current}px ${mouseY.current}px, white, transparent)`,
          WebkitMaskImage: `radial-gradient(250px at ${mouseX.current}px ${mouseY.current}px, white, transparent)`,
        }}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white/20 font-mono font-bold">
          {randomString}
        </p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 text-center flex flex-col items-center justify-center h-full">
        {Icon && (
          <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-10 w-10" />
          </div>
        )}

        {/* Dynamic number or static text */}
        <div className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-baseline justify-center gap-1">
          {value !== undefined ? (
            <>
              <span className="min-w-[3ch] text-center">
                {isInView ? count : 0}
              </span>
              <span>{suffix}</span>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>

        {label && (
          <div className="text-gray-400 text-xs font-medium tracking-wider uppercase">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};
