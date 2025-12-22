import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================
// 1. TIMELINE COMPONENT (with hover expansion)
// ============================================
// This timeline component expands cards on hover
// Key features:
// - Smooth scale animation when hovering
// - Only affects the hovered card
// - Maintains layout stability
interface TimelineEntry {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
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
            From initial intuition to comprehensive analysis
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
              {/* Timeline dot and title */}
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

              {/* Card content - EXPANDS ON HOVER */}
              <div className="relative pl-24 pr-4 md:pl-8 w-full">
                <div className="md:hidden mb-6">
                  <h3 className="text-2xl font-bold text-gray-300 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>

                {/* HOVER EXPANSION: Scale increases from 1 to 1.08 */}
                <motion.div
                  className="relative cursor-pointer"
                  animate={hoveredIndex === index ? {
                    scale: 1.08, // Expands to 108% size
                    y: -8, // Lifts up slightly
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
                  <div
                    className="absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-500"
                    style={{
                      opacity: hoveredIndex === index ? 0.4 : 0,
                      background: hoveredIndex === index
                        ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))'
                        : 'transparent'
                    }}
                  />

                  {/* Main card */}
                  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-blue-500/30 relative overflow-hidden">
                    {/* Content wrapper */}
                    <motion.div
                      animate={hoveredIndex === index ? { scale: 1.02 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.content}
                    </motion.div>
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
            className="absolute md:left-10 left-10 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
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
