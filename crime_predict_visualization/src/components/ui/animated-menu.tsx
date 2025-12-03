import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const STAGGER = 0.035;

interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
  onClick?: () => void;
}

export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className,
  center = false,
  onClick
}) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden cursor-pointer", className)}
      style={{
        lineHeight: 0.85,
      }}
      onClick={onClick}
    >
      {/* Top Text (Slides up) */}
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>

      {/* Bottom Text (Slides in from bottom) */}
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block text-blue-400"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};
