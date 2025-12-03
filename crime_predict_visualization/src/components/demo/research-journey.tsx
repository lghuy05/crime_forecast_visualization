"use client";

import React from "react";
import { ResearchTimeline } from "../ui/research-timeline";
import { Lightbulb, Target, Cpu, BarChart3, Zap, GitBranch, Map, Users } from "lucide-react";

export function ResearchJourney() {
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
              <p className="text-gray-400 text-sm">Deep learning model for complex pattern recognition</p>
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
              <div className="text-2xl font-bold text-blue-300">89%</div>
              <div className="text-xs text-gray-400">Prediction Accuracy</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">250+</div>
              <div className="text-xs text-gray-400">Hotspots Identified</div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-green-300">✓ Model Implementation Complete</span>
            <br />
            <span className="text-amber-300">→ Ongoing: Real-time prediction system</span>
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
              <div className="text-purple-300 text-sm font-semibold">Multi-city Analysis</div>
              <div className="text-gray-400 text-xs">Expanding to additional urban areas</div>
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
    <section className="py-32 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <ResearchTimeline data={timelineData} />
    </section>
  );
}
