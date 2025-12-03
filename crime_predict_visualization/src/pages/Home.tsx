"use client";

import React, { useRef, useState } from 'react';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { BarChart3, Cpu, Map, Target, Zap, GitBranch, Users, Lightbulb, TrendingUp, Shield, Globe, Clock } from 'lucide-react';
import { EnhancedRainbowCard } from '../components/ui/enhanced-rainbow-card';
import { EnhancedAnimatedStats } from '../components/ui/enhanced-animated-stats';
import { ResearchJourney } from '../components/demo/research-journey';
import { BackgroundPaths } from '../components/ui/background-paths'; // This is the loading screen!

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const researchFeatures = [
    {
      icon: Cpu,
      title: "MLP Neural Network",
      description: "Advanced deep learning model for crime prediction with temporal and spatial feature analysis. Achieves 89% accuracy in hotspot identification.",
    },
    {
      icon: Target,
      title: "Lee Algorithm",
      description: "Theory-driven baseline using population heterogeneity and state dependence for hotspot prediction. Serves as our comparative benchmark.",
    },
    {
      icon: Map,
      title: "Spatial Analysis",
      description: "250m grid-based mapping and hotspot identification across multiple urban landscapes with real-time geospatial visualization.",
    },
    {
      icon: BarChart3,
      title: "PAI Metrics",
      description: "Evaluation framework using Prediction Accuracy Index and Hit Rate methodologies for comprehensive model assessment.",
    }
  ];

  const researchStats = [
    {
      label: "Prediction Accuracy",
      value: 89,
      suffix: "%",
      icon: TrendingUp,
      color: "text-blue-400",
      duration: 2500
    },
    {
      label: "Hotspots Identified",
      value: 250,
      suffix: "+",
      icon: Map,
      color: "text-purple-400",
      duration: 3000
    },
    {
      label: "Grid Resolution",
      value: 250,
      suffix: "m",
      icon: Globe,
      color: "text-green-400",
      duration: 2000
    },
    {
      label: "Processing Speed",
      value: 95,
      suffix: "ms",
      icon: Clock,
      color: "text-amber-400",
      duration: 1800
    },
  ];

  return (
    <>
      {isLoading ? (
        <BackgroundPaths
          onComplete={handleLoadingComplete}
          duration={3500}
        />
      ) : (
        <div ref={containerRef} className="bg-black text-white overflow-hidden">
          {/* Hero Section */}
          <HeroGeometric
            badge="Crime Forecasting Research"
            title1="Predictive Analytics"
            title2="For Public Safety"
          />

          {/* Research Introduction */}
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

            {/* Rainbow Cards */}
            <div className='relative mb-32'>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {researchFeatures.map((feature, index) => (
                  <div key={index} className="h-full">
                    <EnhancedRainbowCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Stats Section */}
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

              <EnhancedAnimatedStats stats={researchStats} />
            </div>
          </section>

          {/* Research Journey Timeline */}
          <ResearchJourney />
        </div>
      )}
    </>
  );
};

export default HomePage;
