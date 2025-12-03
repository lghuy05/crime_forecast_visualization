"use client";

import React, { useRef } from 'react';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import { motion } from 'framer-motion';
import { BarChart3, Cpu, Map, Target, Zap, GitBranch, Users, Lightbulb } from 'lucide-react';
import { ResearchCardGlow } from '../components/ui/research-card';
import { ResearchJourney } from '../components/demo/research-journey';

// Simple cn utility
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

const HomePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const researchFeatures = [
    {
      icon: Cpu,
      title: "MLP Neural Network",
      description: "Advanced deep learning model for crime prediction with temporal and spatial feature analysis.",
      color: "from-blue-500 to-cyan-500",
      gradientFrom: "from-blue-500/20",
      gradientTo: "to-cyan-500/10"
    },
    {
      icon: Target,
      title: "Lee Algorithm",
      description: "Theory-driven baseline using population heterogeneity and state dependence for hotspot prediction.",
      color: "from-purple-500 to-pink-500",
      gradientFrom: "from-purple-500/20",
      gradientTo: "to-pink-500/10"
    },
    {
      icon: Map,
      title: "Spatial Analysis",
      description: "250m grid-based mapping and hotspot identification across multiple urban landscapes.",
      color: "from-green-500 to-emerald-500",
      gradientFrom: "from-green-500/20",
      gradientTo: "to-emerald-500/10"
    },
    {
      icon: BarChart3,
      title: "PAI Metrics",
      description: "Evaluation framework using Prediction Accuracy Index and Hit Rate methodologies.",
      color: "from-orange-500 to-red-500",
      gradientFrom: "from-orange-500/20",
      gradientTo: "to-red-500/10"
    }
  ];

  const researchStats = [
    {
      label: "Prediction Accuracy",
      value: 89,
      suffix: "%",
      icon: Zap,
      color: "text-blue-400"
    },
    {
      label: "Hotspots Identified",
      value: 250,
      suffix: "+",
      icon: Map,
      color: "text-purple-400"
    },
    {
      label: "Grid Resolution",
      value: 250,
      suffix: "m",
      icon: Target,
      color: "text-green-400"
    },
    {
      label: "Models Compared",
      value: 2,
      suffix: "",
      icon: GitBranch,
      color: "text-amber-400"
    },
  ];

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <HeroGeometric
          badge="Crime Forecasting Research"
          title1="Predictive Analytics"
          title2="For Public Safety"
        />
      </section>

      {/* Research Introduction */}
      <section className="py-20 px-4 md:px-6 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Crime Prediction
          </h2>
          <p className="text-xl text-white/70 leading-relaxed mb-8">
            Implementing and comparing Lee et al. (2019) crime hotspot prediction algorithm
            with MLP neural networks for spatial-temporal crime forecasting.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-white/60">Research in Progress • Updated Weekly</span>
          </div>
        </motion.div>

        {/* Research Cards with Glowing Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {researchFeatures.map((feature, index) => (
            <ResearchCardGlow
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              gradientFrom={feature.gradientFrom}
              gradientTo={feature.gradientTo}
            />
          ))}
        </div>

        {/* Stats Section - Simplified */}
        <div className="py-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Research <span className="text-blue-400">Impact</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our work contributes to safer communities through data-driven insights
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {researchStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300"
                >
                  <div className={`${stat.color} mb-3 flex justify-center`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Journey Timeline */}
      <ResearchJourney />
    </div>
  );
};

export default HomePage;
