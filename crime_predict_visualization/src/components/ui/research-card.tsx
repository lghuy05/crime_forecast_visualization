import React from "react";
import { GlowingEffect } from "./glowing-effect";

interface ResearchCardGlowProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  onClick?: () => void;
}

export const ResearchCardGlow: React.FC<ResearchCardGlowProps> = ({
  icon: Icon,
  title,
  description,
  color,
  gradientFrom,
  gradientTo,
  onClick,
}) => {
  return (
    <div
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative w-full h-full min-h-[280px]">
        {/* Background glow */}
        <div
          className={`absolute inset-0 h-full w-full bg-gradient-to-br ${gradientFrom} ${gradientTo} transform scale-[0.95] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
        />

        {/* Card container */}
        <div className="relative h-full bg-gray-900/60 backdrop-blur-sm border border-gray-800 px-6 py-8 overflow-hidden rounded-2xl flex flex-col justify-between group-hover:border-gray-700 transition-all duration-300">

          {/* Glowing effect */}
          <GlowingEffect
            spread={30}
            glow={true}
            disabled={false}
            proximity={80}
            inactiveZone={0.3}
            borderWidth={2}
            variant="default"
            movementDuration={3}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-700 to-transparent" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
              {title}
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {description}
            </p>
          </div>

          {/* Footer with button */}
          <div className="relative z-10">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4" />
            <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10 flex items-center justify-center gap-2">
              <span>Explore Research</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
