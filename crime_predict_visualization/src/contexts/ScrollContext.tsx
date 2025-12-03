"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ScrollContextType {
  scrollY: number;
  isScrolled: boolean;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY, isScrolled }}>
      {children}
    </ScrollContext.Provider>
  );
};
