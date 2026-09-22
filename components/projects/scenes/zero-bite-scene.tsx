"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

function mosquitoPath(t: number) {
  const x = 12 + t * 76 + Math.sin(t * 14) * 6;
  const y = 22 + Math.sin(t * 9.5) * 10 + Math.cos(t * 5.2) * 4;
  return { x, y };
}

export function ZeroBiteScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const keyframes = useMemo(
    () => Array.from({ length: 8 }, (_, i) => mosquitoPath(i / 7)),
    []
  );

  return (
    <div
      ref={ref}
      className="relative h-52 overflow-hidden border border-ink/15 bg-paper md:h-64"
      aria-hidden="true"
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60">
        <path d="M0 48 C 20 44, 40 52, 100 46" stroke="#030303" strokeWidth="0.8" fill="none" />
        <motion.path
          d="M8 52 C 18 40, 28 38, 40 30 C 52 22, 64 28, 88 18"
          fill="none"
          stroke="#6E1F24"
          strokeWidth="1.1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView || reduceMotion ? 1 : 0.15 }}
          transition={{ duration: 1.6 }}
        />
        {[18, 34, 52, 70].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={38 - i * 3}
            r="1.1"
            fill="#030303"
            animate={
              reduceMotion
                ? undefined
                : { cy: [38 - i * 3, 30 - i * 2, 38 - i * 3], opacity: [0.4, 1, 0.4] }
            }
            transition={{ duration: 2.2 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </svg>
      <motion.div
        className="absolute"
        animate={
          reduceMotion
            ? { left: "58%", top: "28%" }
            : {
                left: keyframes.map((p) => `${p.x}%`),
                top: keyframes.map((p) => `${p.y}%`)
              }
        }
        transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
      >
        <Mosquito />
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-[8%] w-16"
        animate={reduceMotion ? undefined : { x: inView ? [0, 24, 8] : 0 }}
        transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <LineCharacter pose={reduceMotion ? "idle" : "walk"} duration={0.7} />
      </motion.div>
    </div>
  );
}

function Mosquito() {
  return (
    <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
      <motion.ellipse
        cx="10"
        cy="10"
        rx="7"
        ry="3.2"
        stroke="#030303"
        strokeWidth="1.6"
        animate={{ rotate: [-6, 8, -6] }}
        transition={{ duration: 0.28, repeat: Infinity }}
      />
      <path d="M17 10 L26 6" stroke="#030303" strokeWidth="1.4" />
      <motion.path
        d="M8 10 C 4 2, 16 2, 12 10"
        stroke="#6E1F24"
        strokeWidth="1.2"
        animate={{ d: ["M8 10 C 4 2, 16 2, 12 10", "M8 10 C 2 6, 18 0, 12 10", "M8 10 C 4 2, 16 2, 12 10"] }}
        transition={{ duration: 0.18, repeat: Infinity }}
      />
    </svg>
  );
}
