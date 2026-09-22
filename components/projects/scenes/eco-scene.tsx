"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

export function EcoScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-44 overflow-hidden border border-ink/15 bg-paper md:h-52"
      aria-hidden="true"
    >
      {[18, 38, 58].map((left, index) => (
        <motion.span
          key={left}
          className="absolute bottom-8 h-2 w-4 bg-ink/70"
          style={{ left: `${left}%` }}
          animate={
            inView && !reduceMotion
              ? { x: [0, 80 - left], y: [0, -6, 10], opacity: [1, 1, 0] }
              : undefined
          }
          transition={{
            duration: 2.8,
            delay: index * 0.28,
            repeat: Infinity,
            repeatDelay: 1.4
          }}
        />
      ))}
      <motion.div
        className="absolute bottom-10 right-8 origin-bottom"
        animate={
          inView && !reduceMotion
            ? { scaleY: [0.7, 1.08, 1], scaleX: [0.9, 1.04, 1] }
            : { scale: 1 }
        }
        transition={{ duration: 2.2, delay: 0.8 }}
      >
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <path d="M14 34 V16" stroke="#030303" strokeWidth="2" />
          <path
            d="M14 18 C6 8, 18 2, 20 14"
            stroke="#030303"
            strokeWidth="2"
          />
          <circle cx="18" cy="8" r="3" fill="#6E1F24" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-0 w-20"
        animate={
          reduceMotion
            ? { left: "36%" }
            : { left: inView ? ["6%", "62%", "6%"] : "6%" }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <LineCharacter
          pose={reduceMotion ? "idle" : "walk"}
          carry="plant"
          hair="bun"
          duration={0.58}
        />
      </motion.div>
    </div>
  );
}
