
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface EnhancedAnimatedStat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration?: number;
}

interface EnhancedAnimatedStatsProps {
  stats: EnhancedAnimatedStat[];
  className?: string;
}

export const EnhancedAnimatedStats: React.FC<EnhancedAnimatedStatsProps> = ({ stats, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [isInView, setIsInView] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          setIsInView(true);
          animatedRef.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const ctx = gsap.context(() => {
      // Animate each stat card entrance
      statRefs.current.forEach((stat, index) => {
        if (!stat) return;

        // Card entrance animation
        gsap.fromTo(stat,
          { opacity: 0, y: 50, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'back.out(1.7)'
          }
        );

        // Icon animation
        const icon = stat.querySelector('.stat-icon');
        if (icon) {
          gsap.fromTo(icon,
            { scale: 0, rotation: -180 },
            {
              scale: 1,
              rotation: 0,
              duration: 0.8,
              delay: index * 0.15 + 0.2,
              ease: 'back.out(1.7)'
            }
          );
        }

        // Number counting animation
        const valueSpan = valueRefs.current[index];
        if (valueSpan) {
          const targetValue = stats[index].value;
          const duration = (stats[index].duration || 2000) / 1000;

          gsap.to(valueSpan, {
            innerHTML: targetValue,
            duration: duration,
            delay: index * 0.15 + 0.4,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function () {
              const value = Math.floor(parseFloat(this.targets()[0].innerHTML));
              this.targets()[0].innerHTML = value.toString();
            }
          });
        }
      });

      // Add subtle pulse animation to all icons
      statRefs.current.forEach((stat, index) => {
        if (!stat) return;

        const icon = stat.querySelector('.stat-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1.1,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.3
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [isInView, stats]);

  const handleMouseEnter = (index: number) => {
    const stat = statRefs.current[index];
    if (!stat) return;

    // Kill existing animations for this stat
    gsap.killTweensOf(stat);

    // Hover animations
    gsap.to(stat, {
      scale: 1.1,
      y: -10,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });

    gsap.to(stat, {
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      borderColor: stats[index].color.replace('text', 'rgb').split(' ')[0],
      duration: 0.3
    });

    // Icon spin on hover
    const icon = stat.querySelector('.stat-icon');
    if (icon) {
      gsap.to(icon, {
        rotation: 360,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });
    }

    // Number bounce
    const numberElement = stat.querySelector('.stat-number');
    if (numberElement) {
      gsap.to(numberElement, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const stat = statRefs.current[index];
    if (!stat) return;

    // Reset animations
    gsap.to(stat, {
      scale: 1,
      y: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      duration: 0.4,
      ease: 'power2.out'
    });

    // Reset icon
    const icon = stat.querySelector('.stat-icon');
    if (icon) {
      gsap.to(icon, {
        rotation: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }

    // Reset number
    const numberElement = stat.querySelector('.stat-number');
    if (numberElement) {
      gsap.to(numberElement, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              ref={el => statRefs.current[index] = el}
              className="relative cursor-pointer h-full"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Glowing background effect on hover */}
              <div className={`absolute -inset-2 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-30 ${stat.color.replace('text', 'bg')} blur-xl`} />

              {/* Main stat card */}
              <div className="relative h-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center transition-all duration-300 hover:border-gray-600 flex flex-col items-center justify-center">

                {/* Icon with pulse effect */}
                <div className={`${stat.color} mb-4 stat-icon`}>
                  <Icon className="h-10 w-10" />
                </div>

                {/* Animated number with suffix */}
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white flex items-baseline justify-center gap-1">
                  <span
                    ref={el => valueRefs.current[index] = el}
                    className="stat-number inline-block min-w-[2ch] text-center"
                  >
                    0
                  </span>
                  <span>{stat.suffix}</span>
                </div>

                {/* Label */}
                <div className="relative mt-2">
                  <div className="text-gray-400 text-xs font-medium tracking-wider uppercase leading-tight">
                    {stat.label}
                  </div>
                  {/* Animated underline */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-300 group-hover:w-full" />
                </div>

                {/* Floating particles - only show on hover */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${stat.color.replace('text', 'bg')}`}
                      style={{
                        left: `${20 + i * 30}%`,
                        top: '20%',
                        animation: `float ${2 + i * 0.5}s ease-in-out infinite`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
