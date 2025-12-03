"use client";

import React, { useEffect } from 'react';

interface SectionAnchorProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionAnchor: React.FC<SectionAnchorProps> = ({
  id,
  children,
  className = ""
}) => {
  useEffect(() => {
    // Check if this section should be scrolled to
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection === id) {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -80; // Adjust for navbar height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          sessionStorage.removeItem('scrollToSection');
        }
      }, 200);
    }
  }, [id]);

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};
