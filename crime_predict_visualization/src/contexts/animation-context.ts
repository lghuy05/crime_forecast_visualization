import { createContext } from "react";

export interface AnimationContextType {
  registerAnimation: (id: string, animation: gsap.core.Tween) => void;
  triggerAnimation: (id: string) => void;
}

export const AnimationContext = createContext<AnimationContextType | undefined>(undefined);
