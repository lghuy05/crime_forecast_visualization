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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
              className="flex justify-start pt-20 md:pt-32 md:gap-16"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
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

                <motion.div
                  className="relative cursor-pointer"
                  animate={hoveredIndex === index ? {
                    scale: 1.05,
                    y: -5,
                    zIndex: 50
                  } : {
                    scale: 1,
                    y: 0,
                    zIndex: 1
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 rounded-2xl blur-lg opacity-0 transition-opacity duration-500"
                    style={{
                      opacity: hoveredIndex === index ? 0.3 : 0,
                      background: hoveredIndex === index
                        ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.2))'
                        : 'transparent'
                    }}
                  />

                  {/* Main card */}
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-blue-500/30 relative overflow-hidden">

                    {/* Animated background gradient on hover */}
                    {hoveredIndex === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {/* Content wrapper with scale effect */}
                    <motion.div
                      animate={hoveredIndex === index ? {
                        scale: 1.02,
                      } : {
                        scale: 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.content}
                    </motion.div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300"
                      style={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    >
                      <div className="flex items-center gap-1 text-xs text-blue-400">
                        <span>Hovering</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="hidden md:block mt-4">
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Timeline line */}
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
