"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

export function GwizaScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-44 overflow-hidden border border-ink/15 bg-paper md:h-52"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 40">
        <motion.line
          x1="22"
          y1="22"
          x2="78"
          y2="22"
          stroke="#6E1F24"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView || reduceMotion ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        />
      </svg>
      <motion.div
        className="absolute bottom-1 w-20"
        animate={
          reduceMotion
            ? { left: "18%" }
            : { left: inView ? ["2%", "28%"] : "2%" }
        }
        transition={{ duration: 1.4, type: "spring", stiffness: 120, damping: 16 }}
      >
        <LineCharacter pose={inView && !reduceMotion ? "walk" : "idle"} hair="short" />
      </motion.div>
      <motion.div
        className="absolute bottom-1 w-20"
        animate={
          reduceMotion
            ? { right: "18%" }
            : { right: inView ? ["2%", "28%"] : "2%" }
        }
        transition={{ duration: 1.4, type: "spring", stiffness: 120, damping: 16 }}
      >
        <LineCharacter
          pose={inView && !reduceMotion ? "walk" : "idle"}
          hair="puff"
          accent
        />
      </motion.div>
    </div>
  );
}
