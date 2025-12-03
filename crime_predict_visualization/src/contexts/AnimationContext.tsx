"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimationContextType {
  registerAnimation: (id: string, animation: gsap.core.Tween) => void;
  triggerAnimation: (id: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const animations = React.useRef<Map<string, gsap.core.Tween>>(new Map());

  const registerAnimation = (id: string, animation: gsap.core.Tween) => {
    animations.current.set(id, animation);
  };

  const triggerAnimation = (id: string) => {
    const animation = animations.current.get(id);
    if (animation) {
      animation.play();
    }
  };

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <AnimationContext.Provider value={{ registerAnimation, triggerAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};
