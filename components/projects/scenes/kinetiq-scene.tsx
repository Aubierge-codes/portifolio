"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function KinetiqScene() {
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [pulse, setPulse] = useState(0);

  return (
    <button
      ref={ref}
      type="button"
      className="relative h-44 w-full overflow-hidden border border-ink/15 bg-paper text-left md:h-52"
      onClick={() => setPulse((value) => value + 1)}
      aria-label="Trigger piezo vibration"
    >
      <motion.span
        className="absolute left-1/2 top-6 h-8 w-8 -translate-x-1/2 rounded-full bg-ink"
        animate={
          reduceMotion
            ? undefined
            : inView
              ? {
                  y: [0, 54, 54],
                  scaleY: [1, 1.1, 0.72, 1],
                  scaleX: [1, 0.9, 1.12, 1]
                }
              : undefined
        }
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.5 }}
        key={pulse}
      />
      <motion.div
        className="absolute bottom-10 left-1/2 h-3 w-28 -translate-x-1/2 bg-ink"
        animate={
          reduceMotion
            ? undefined
            : {
                scaleY: inView ? [1, 1.8, 1] : 1,
                scaleX: inView ? [1, 1.06, 1] : 1
              }
        }
        transition={{ duration: 0.28, repeat: Infinity, repeatDelay: 1.3 }}
      />
      <svg
        className="absolute inset-x-8 bottom-4 h-8 w-[calc(100%-4rem)]"
        viewBox="0 0 120 24"
      >
        <motion.path
          d="M0 12 H24 L32 4 L40 20 L48 8 L56 16 H120"
          fill="none"
          stroke="#6E1F24"
          strokeWidth="1.8"
          initial={{ pathLength: 0.2 }}
          animate={
            reduceMotion ? { pathLength: 1 } : { pathLength: [0.2, 1, 0.2] }
          }
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </svg>
    </button>
  );
}
