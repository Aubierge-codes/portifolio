"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type BalloonTone = "ink" | "paper" | "maroon";

type FloatingBalloonProps = {
  tone?: BalloonTone;
  label?: string;
  className?: string;
  delay?: number;
};

const fills: Record<BalloonTone, string> = {
  ink: "#030303",
  paper: "#FFFFFF",
  maroon: "#6E1F24"
};

export function FloatingBalloon({
  tone = "ink",
  label,
  className,
  delay = 0
}: FloatingBalloonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [18, -40]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex flex-col items-center", className)}
      style={reduceMotion ? undefined : { y }}
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: [-4, 5, -3],
              x: [-4, 6, -4]
            }
      }
      transition={{
        duration: 4.2 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 64 92" width="64" height="92" fill="none">
        <ellipse
          cx="32"
          cy="28"
          rx="22"
          ry="26"
          fill={fills[tone]}
          stroke="#030303"
          strokeWidth="2.2"
        />
        <path
          d="M32 54 L28 62 H36 Z"
          fill={fills[tone]}
          stroke="#030303"
          strokeWidth="1.6"
        />
        <path
          d="M32 62 C28 72, 36 78, 32 88"
          stroke="#030303"
          strokeWidth="1.6"
          fill="none"
        />
        {label ? (
          <text
            x="32"
            y="32"
            textAnchor="middle"
            fill={tone === "paper" ? "#030303" : "#FFFFFF"}
            fontSize="9"
            fontFamily="var(--font-dm-sans), sans-serif"
          >
            {label}
          </text>
        ) : null}
      </svg>
    </motion.div>
  );
}
