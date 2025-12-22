
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface AnimatedStat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration?: number;
}

interface AnimatedStatsProps {
  stats: AnimatedStat[];
  className?: string;
}

const CountUpNumber: React.FC<{
  end: number;
  suffix: string;
  duration: number;
  isInView: boolean;
}> = ({ end, suffix, duration, isInView }) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = null;
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, isInView]);

  return (
    <span className="inline-block min-w-[3ch] text-center">
      {count}
      {suffix}
    </span>
  );
};

export const AnimatedStats: React.FC<AnimatedStatsProps> = ({ stats, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [isInView, controls, hasAnimated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      className={`w-full ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative h-full cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={isHovered ? {
                scale: 1.05,
                y: -8,
                zIndex: 50
              } : {
                scale: 1,
                y: 0,
                zIndex: 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Background glow */}
              <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-0 ${isHovered ? 'opacity-30' : ''} transition-opacity duration-500 ${stat.color.replace('text', 'bg')}/20`} />

              {/* Main stat card */}
              <div className="relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 text-center hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 h-full flex flex-col items-center justify-center">

                {/* Icon with pulse animation */}
                <motion.div
                  className={`${stat.color} mb-4 md:mb-6`}
                  animate={isInView ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2
                  }}
                >
                  <Icon className={`h-8 w-8 md:h-10 md:w-10 ${isHovered ? 'scale-110' : ''} transition-transform duration-300`} />
                </motion.div>

                {/* Animated number */}
                <motion.div
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.1 + 0.3
                  }}
                >
                  <CountUpNumber
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={stat.duration || 2000}
                    isInView={isInView}
                  />
                </motion.div>

                {/* Label with underline animation */}
                <div className="relative inline-block mt-2">
                  <div className={`text-gray-400 text-xs md:text-sm font-medium tracking-wide ${isHovered ? 'text-gray-300' : ''} transition-colors duration-300`}>
                    {stat.label}
                  </div>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent"
                    initial={false}
                    animate={{ width: isHovered ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
