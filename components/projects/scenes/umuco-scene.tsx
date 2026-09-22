"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

const points = [
  { x: 18, y: 62, label: "01" },
  { x: 46, y: 38, label: "02" },
  { x: 74, y: 54, label: "03" }
];

export function UmucoScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-48 overflow-hidden border border-ink/15 bg-paper md:h-56"
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M8 58 C 22 58, 28 40, 46 38 C 62 36, 66 54, 92 48"
          fill="none"
          stroke="#030303"
          strokeWidth="1.2"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: inView || reduceMotion ? 1 : 0.2 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        {points.map((point, index) => (
          <motion.g
            key={point.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              inView || reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.3, scale: 0.8 }
            }
            transition={{ delay: 0.24 + index * 0.18, type: "spring" }}
          >
            <circle cx={point.x} cy={point.y} r="2.2" fill="#6E1F24" />
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="none"
              stroke="#030303"
              strokeWidth="0.6"
            />
          </motion.g>
        ))}
      </svg>
      <motion.div
        className="absolute bottom-0 w-20"
        animate={
          reduceMotion
            ? { left: "42%" }
            : inView
              ? { left: ["8%", "38%", "68%"] }
              : { left: "8%" }
        }
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <LineCharacter pose={reduceMotion ? "idle" : "walk"} duration={0.62} hair="bun" />
      </motion.div>
      <motion.div
        className="absolute right-4 top-4 border border-ink bg-paper px-3 py-2 text-[11px] leading-4"
        animate={
          inView && !reduceMotion ? { y: [6, 0], opacity: [0, 1] } : { opacity: 1 }
        }
      >
        Path → place → story
      </motion.div>
    </div>
  );
}
