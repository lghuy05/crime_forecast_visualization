"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Lightbulb, Target, Cpu, BarChart3, Map, Users, Zap, GitBranch } from "lucide-react";

interface TimelineEntry {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const ResearchTimeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-transparent font-sans" ref={containerRef}>
      <div className="max-w-6xl mx-auto py-20 px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Research Journey
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From initial intuition to comprehensive analysis - our systematic approach to crime forecasting
          </p>
        </div>

        <div ref={ref} className="relative">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-20 md:pt-32 md:gap-16" // Increased spacing
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-12 w-12 absolute left-4 md:left-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="hidden md:block text-xl md:pl-24 md:text-3xl font-bold text-gray-300">
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-24 pr-4 md:pl-8 w-full">
                <div className="md:hidden mb-6">
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
                  {item.content}
                </div>

                <div className="hidden md:block mt-4">
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Timeline line with better styling */}
          <div
            style={{ height: height + "px" }}
            className="absolute md:left-10 left-10 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-500 via-purple-500 to-transparent rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
