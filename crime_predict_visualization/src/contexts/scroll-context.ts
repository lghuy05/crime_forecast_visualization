import { createContext } from "react";

export interface ScrollContextType {
  scrollY: number;
  isScrolled: boolean;
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined);
