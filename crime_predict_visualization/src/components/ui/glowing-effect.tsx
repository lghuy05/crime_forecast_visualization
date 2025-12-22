
import { memo, useCallback, useEffect, useRef } from "react";

// Simple cn utility
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    variant = "default",
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const angleRef = useRef<number>(0);

    const handleMove = useCallback(
      (e?: MouseEvent) => {
        if (!containerRef.current || disabled) return;

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        animationRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          if (!e) {
            // If no mouse event, create a gentle animation
            angleRef.current += 0.5;
            element.style.setProperty("--start", String(angleRef.current));
            element.style.setProperty("--active", "1");
            return;
          }

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle = angleRef.current;
          const targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
            Math.PI +
            90;

          // Smooth transition
          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          angleRef.current = currentAngle + angleDiff * 0.1;
          element.style.setProperty("--start", String(angleRef.current));
        });
      },
      [inactiveZone, proximity, disabled]
    );

    useEffect(() => {
      if (disabled) return;

      // Gentle auto-rotation when no mouse movement
      const autoRotate = () => {
        const speedFactor = Math.max(0.25, movementDuration);
        angleRef.current += 0.4 / speedFactor;
        if (containerRef.current) {
          containerRef.current.style.setProperty("--start", String(angleRef.current));
          containerRef.current.style.setProperty("--active", "1");
        }
        animationRef.current = requestAnimationFrame(autoRotate);
      };

      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      document.addEventListener("pointermove", handlePointerMove);
      animationRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        document.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    // Simplified gradient to reduce performance cost
    const gradient =
      variant === "white"
        ? `linear-gradient(45deg, #ffffff20, #ffffff10, #ffffff05)`
        : `radial-gradient(circle at 50% 50%, 
            rgba(59, 130, 246, 0.3) 0%, 
            rgba(139, 92, 246, 0.2) 25%, 
            rgba(236, 72, 153, 0.2) 50%, 
            transparent 70%),
          conic-gradient(
            from var(--start)deg at 50% 50%,
            rgba(59, 130, 246, 0.3),
            rgba(139, 92, 246, 0.2),
            rgba(236, 72, 153, 0.2),
            rgba(59, 130, 246, 0.3)
          )`;

    return (
      <div
        ref={containerRef}
        style={
          {
            "--blur": `${blur}px`,
            "--spread": `${spread}deg`,
            "--start": "0",
            "--active": "0",
            "--border-width": `${borderWidth}px`,
            "--gradient": gradient,
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
          glow && "opacity-100",
          blur > 0 && "blur-[var(--blur)]",
          className,
          disabled && "hidden"
        )}
      >
        <div
          className={cn(
            "rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--border-width))]',
            "after:[border:var(--border-width)_solid_transparent]",
            "after:[background:var(--gradient)]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-500"
          )}
        />
      </div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
