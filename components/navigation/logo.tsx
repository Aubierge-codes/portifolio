"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type LogoProps = {
  className?: string;
  size?: number;
};

export function Logo({ className, size = 40 }: LogoProps) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      className={cn("inline-flex", className)}
      aria-hidden="true"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={reduceMotion ? { opacity: 0 } : { scaleX: 0.72, scaleY: 1.18 }}
      animate={
        reduceMotion
          ? { opacity: 1 }
          : {
              scaleX: [0.72, 0.82, 1.12, 0.96, 1],
              scaleY: [1.18, 0.88, 1.06, 0.98, 1]
            }
      }
      whileHover={
        reduceMotion
          ? undefined
          : {
              scaleX: [1, 1.08, 0.96, 1.02, 1],
              scaleY: [1, 0.94, 1.06, 0.99, 1],
              rotate: [0, -4, 3, 0]
            }
      }
      transition={{ duration: 0.55, ease: [0.22, 1.2, 0.36, 1] }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        fill="none"
        width={size}
        height={size}
        className="overflow-visible"
      >
        <motion.path
          d="M28 50 C 15 32, 15 68, 28 50 C 42 32, 58 68, 72 50 C 85 32, 85 68, 72 50 C 58 32, 42 68, 28 50 Z"
          stroke="#111110"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={
            reduceMotion ? { pathLength: 1 } : { pathLength: 0, opacity: 0.4 }
          }
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: "easeInOut" }}
        />
        {/* Animated on a wrapping <g> rather than the circle itself. Scaling an
            SVG shape directly makes framer drive its geometry attributes, and
            with cx/cy supplied as plain props it had nothing to write back —
            emitting cy="undefined" and an SVG attribute error on every pulse. */}
        <motion.g
          animate={
            reduceMotion || !hovered
              ? { scale: 1, opacity: 1 }
              : {
                  scale: [1, 1.35, 1],
                  opacity: [1, 0.7, 1]
                }
          }
          transition={{
            duration: 0.7,
            repeat: hovered ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <circle cx="50" cy="50" r="3" fill="#EB5A3C" />
        </motion.g>
      </svg>
    </motion.span>
  );
}
