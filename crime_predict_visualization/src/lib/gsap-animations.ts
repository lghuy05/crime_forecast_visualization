import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateOnScroll = (target: string, options = {}) => {
  return gsap.fromTo(target,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: target,
        start: "top 80%",
        toggleActions: "play none none reverse",
        ...options
      }
    }
  );
};

export const createParallaxEffect = (target: string, speed = 0.5) => {
  gsap.to(target, {
    yPercent: -speed * 100,
    ease: "none",
    scrollTrigger: {
      trigger: target,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

export const staggerAnimation = (target: string, stagger = 0.1) => {
  return gsap.fromTo(target,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      stagger,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: target,
        start: "top 85%"
      }
    }
  );
};
