"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface EnhancedRainbowCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
  targetPage?: string; // New: Target page URL
  targetSection?: string; // New: Target section ID on the page
}

export const EnhancedRainbowCard: React.FC<EnhancedRainbowCardProps> = ({
  icon: Icon,
  title,
  description,
  index,
  targetPage = "/ourwork", // Default to OurWork page
  targetSection = "" // Default to no specific section
}) => {
  const handleViewDetail = (e: React.MouseEvent) => {
    // If there's a specific section, we need to store it for navigation
    if (targetSection) {
      sessionStorage.setItem('scrollToSection', targetSection);
    }
    // Navigation happens via Link, so we don't need to prevent default
  };

  return (
    <div className="h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative h-full"
      >
        <div
          className={cn(
            "relative h-full overflow-hidden rounded-2xl border p-6",
            "bg-gradient-to-br from-gray-900 via-black to-gray-900",
            "border-gray-800 hover:border-blue-500/50 transition-all duration-300"
          )}
        >
          {/* Card content */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-4">
                <Icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>

            {/* View Detail Button */}
            <div className="mt-auto pt-4">
              <Link
                to={`${targetPage}${targetSection ? `#${targetSection}` : ''}`}
                onClick={handleViewDetail}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
                  "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
                  "border border-blue-500/20 hover:border-blue-500/40",
                  "text-blue-400 hover:text-blue-300",
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                <span>View Details</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Rainbow gradient effect */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            )}
          />
        </div>
      </motion.div>
    </div>
  );
};
