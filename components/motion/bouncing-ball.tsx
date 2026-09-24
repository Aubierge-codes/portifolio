"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { bounceSpring } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type BouncingBallProps = {
  className?: string;
  layoutId?: string;
  size?: number;
  animate?: boolean;
};

export function BouncingBall({
  className,
  layoutId = "story-ball",
  size = 22,
  animate = true
}: BouncingBallProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      layoutId={reduceMotion ? undefined : layoutId}
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
      animate={
        reduceMotion || !animate
          ? undefined
          : {
              y: [0, -10, 0],
              scaleX: [1, 0.92, 1.08, 1],
              scaleY: [1, 1.12, 0.9, 1]
            }
      }
      transition={
        reduceMotion || !animate
          ? { duration: 0.2 }
          : { ...bounceSpring, repeat: Infinity, repeatDelay: 0.35 }
      }
    >
      <span
        className="block h-full w-full rounded-full bg-ink"
        style={{ boxShadow: "inset -4px -5px 0 rgba(255,255,255,0.18)" }}
      />
      <span className="absolute -bottom-1 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-ink/20" />
    </motion.span>
  );
}
