import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = (callback: (gsap: typeof gsap) => void, dependencies: any[] = []) => {
  const context = useRef<gsap.Context>();

  useEffect(() => {
    context.current = gsap.context(() => {
      callback(gsap);
    });

    return () => {
      context.current?.revert();
    };
  }, dependencies);
};

export const useScrollAnimation = () => {
  const triggerAnimation = (target: string, animation: gsap.TweenVars) => {
    gsap.fromTo(target,
      { opacity: 0, y: 50 },
      {
        ...animation,
        scrollTrigger: {
          trigger: target,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }
    );
  };

  return { triggerAnimation };
};
