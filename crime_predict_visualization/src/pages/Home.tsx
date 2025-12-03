"use client";

import React, { useRef, useState, useEffect } from 'react';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { BarChart3, Cpu, Map, Target, TrendingUp, Globe, Clock, Lightbulb, Zap, GitBranch, Lock } from 'lucide-react';
import { GooeyText } from '../components/ui/gooey-text-morphing';
import { Timeline } from '../components/ui/timeline';

// Custom hook to detect page refresh (simplified)
const useIsPageRefresh = () => {
  const [isRefresh, setIsRefresh] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('homePageLoaded');

    if (hasLoaded) {
      setIsRefresh(false);
    } else {
      setTimeout(() => {
        sessionStorage.setItem('homePageLoaded', 'true');
      }, 100);
    }
  }, []);

  return isRefresh;
};

// Loading Screen Component
const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <GooeyText
        texts={["Welcome", "to", "CSAIL"]}
        morphTime={1.2}
        cooldownTime={0.6}
        className="font-bold"
      />
    </motion.div>
  );
};

// 1. MLP CARD (Coming Soon) - Updated for new layout
interface MLPCardProps {
  index: number;
}

const MLPCardFixed: React.FC<MLPCardProps> = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] cursor-default group">
        {/* Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 mb-4 relative">
            <Cpu className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            <Lock className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
          </div>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-white">MLP Neural Network</h3>
            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          Advanced deep learning model for crime prediction with temporal and spatial feature analysis.
          Currently in development with target accuracy of 89%+.
        </p>

        {/* Coming Soon Button - Non-clickable */}
        <div className="mt-auto pt-4 border-t border-gray-800">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-400 cursor-not-allowed">
            <span>Coming Soon</span>
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <p className="text-amber-400 text-xs mt-2">
            Available Q4 2024 • Currently in development
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 2. STAT CARD - Fixed for Home page
interface StatCardProps {
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  suffix?: string;
}

const StatCardFixed: React.FC<StatCardProps> = ({ value, icon: Icon, label, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Start counting animation
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
              setHasAnimated(true);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="h-64">
      <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-blue-500/30 transition-all duration-300 group">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Icon */}
          <div className="text-blue-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Icon className="h-10 w-10" />
          </div>

          {/* Animated Value */}
          <div className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-baseline">
            <span className="min-w-[3ch] text-center">
              {count}
            </span>
            <span>{suffix}</span>
          </div>

          {/* Label */}
          <div className="text-gray-400 text-xs font-medium tracking-wider uppercase text-center">
            {label}
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN HOME PAGE COMPONENT - UPDATED
// ============================================

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPageRefresh = useIsPageRefresh();
  const [isLoading, setIsLoading] = useState(isPageRefresh);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Research stats for stat cards
  const researchStats = [
    {
      value: 89,
      suffix: "%",
      icon: TrendingUp,
      label: "Target Accuracy"
    },
    {
      value: 250,
      suffix: "+",
      icon: Map,
      label: "Hotspots Identified"
    },
    {
      value: 250,
      suffix: "m",
      icon: Globe,
      label: "Grid Resolution"
    },
    {
      value: 95,
      suffix: "ms",
      icon: Clock,
      label: "Processing Speed"
    },
  ];

  // Timeline data for research journey
  const timelineData = [
    {
      title: "Intuition & Motivation",
      subtitle: "Why crime forecasting matters",
      icon: <Lightbulb className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            Crime imposes significant social and economic costs. Traditional policing methods
            are reactive, but what if we could <span className="text-blue-400">predict where and when crimes are likely to occur</span>
            before they happen?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-blue-300 text-sm font-semibold">Problem</div>
              <div className="text-gray-400 text-xs">Reactive policing leads to inefficient resource allocation</div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-purple-300 text-sm font-semibold">Opportunity</div>
              <div className="text-gray-400 text-xs">Advanced analytics can transform public safety</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Research Purpose",
      subtitle: "Defining our objectives",
      icon: <Target className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            Our research aims to bridge the gap between traditional statistical methods
            and modern machine learning for crime prediction.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-gray-300">Compare Lee Algorithm vs MLP Neural Networks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-gray-300">Improve spatial-temporal crime forecasting accuracy</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-gray-300">Develop accessible tools for law enforcement</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Methodological Approach",
      subtitle: "How we conduct our research",
      icon: <Cpu className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            We employ a dual-model approach, comparing traditional statistical methods
            with advanced machine learning techniques.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-blue-400 font-semibold mb-2">Lee Algorithm</div>
              <p className="text-gray-400 text-sm">Theory-driven baseline using population heterogeneity</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-xl">
              <div className="text-purple-400 font-semibold mb-2">MLP Neural Network</div>
              <p className="text-gray-400 text-sm">Coming soon - advanced deep learning model</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Data & Analysis",
      subtitle: "Working with real crime data",
      icon: <BarChart3 className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            We analyze multiple urban crime datasets with spatial-temporal features.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Portland Dataset</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Chicago Dataset</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">NYC Dataset</span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs">250m Grid Resolution</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-blue-300">✓ Temporal Features:</span> Monthly/Weekly crime patterns
            <br />
            <span className="text-purple-300">✓ Spatial Features:</span> Geographic coordinates, neighborhood data
          </div>
        </div>
      ),
    },
    {
      title: "Current Progress",
      subtitle: "What we've accomplished so far",
      icon: <Zap className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            Our research has yielded promising results in crime hotspot prediction.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-300">74.9%</div>
              <div className="text-xs text-gray-400">Current PEI</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">250+</div>
              <div className="text-xs text-gray-400">Hotspots Identified</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-green-300">✓ Lee Algorithm Complete</span>
            <br />
            <span className="text-purple-300">→ MLP Network: Coming Soon</span>
          </div>
        </div>
      ),
    },
    {
      title: "Future Directions",
      subtitle: "Where we're headed next",
      icon: <GitBranch className="h-3 w-3 text-white" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-base mb-4">
            We plan to expand our research in several key areas to enhance practical applications.
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-blue-300 text-sm font-semibold">Real-time Integration</div>
              <div className="text-gray-400 text-xs">Live data streaming for instant predictions</div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-purple-300 text-sm font-semibold">MLP Neural Network</div>
              <div className="text-gray-400 text-xs">Coming soon with enhanced accuracy</div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-green-300 text-sm font-semibold">Public Dashboard</div>
              <div className="text-gray-400 text-xs">Interactive visualization tools</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {!isLoading && (
        <div ref={containerRef} className="bg-black text-white overflow-hidden">
          <HeroGeometric
            badge="Crime Forecasting Research"
            title1="Predictive Analytics"
            title2="For Public Safety"
          />

          <section className="py-20 px-4 md:px-6 container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl mx-auto text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cutting-Edge Research
                </span>
                <span className="text-white"> in Crime Prediction</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                We combine traditional criminological theories with modern machine learning
                to create predictive models that help law enforcement prevent crimes before they happen.
              </p>
            </motion.div>

            {/* MLP Card Section - SIMPLIFIED */}
            <div className="max-w-4xl mx-auto mb-32">
              <div className="grid grid-cols-1 gap-6">
                <MLPCardFixed index={0} />
              </div>

              {/* Explanation text */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 text-lg">
                  Explore our research methodologies, algorithms, and findings in detail on the{" "}
                  <span className="text-blue-400 font-semibold">Our Work</span> page.
                </p>
              </div>
            </div>

            {/* Research Metrics Section */}
            <div className="py-12 mb-32">
              <div className="text-center mb-16">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">Research </span>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Metrics & Impact
                  </span>
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Quantitative results demonstrating the effectiveness of our predictive models
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {researchStats.map((stat, index) => (
                  <StatCardFixed
                    key={index}
                    value={stat.value}
                    suffix={stat.suffix}
                    icon={stat.icon}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Research Journey Timeline */}
          <section className="py-32 bg-gradient-to-b from-black via-gray-900/50 to-black">
            <Timeline data={timelineData} />
          </section>
        </div>
      )}
    </>
  );
};

export default HomePage;
