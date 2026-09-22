"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

export function VeloraScene() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="relative h-40 overflow-hidden border border-ink/15 md:h-48" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="absolute top-8 h-16 w-16 border border-ink bg-paper"
          initial={{ left: 12 + index * 18, y: 18, opacity: 0.4 }}
          animate={
            inView || reduceMotion
              ? { left: 28 + index * 22, y: 0, opacity: 1 }
              : { left: 12 + index * 18, y: 18, opacity: 0.4 }
          }
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: index * 0.12 }}
        />
      ))}
      <motion.div
        className="absolute bottom-0 w-16"
        animate={reduceMotion ? { left: "8%" } : { left: inView ? ["4%", "58%"] : "4%" }}
        transition={{ duration: 2.2 }}
      >
        <LineCharacter pose={inView && !reduceMotion ? "push" : "idle"} />
      </motion.div>
    </div>
  );
}

export function WeatherScene() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-40 overflow-hidden border border-ink/15 md:h-48" aria-hidden="true">
      <motion.span
        className="absolute top-8 h-10 w-16 rounded-full border border-ink"
        animate={reduceMotion ? { left: "40%" } : { left: ["8%", "70%", "8%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute right-10 top-10 h-10 w-10 rounded-full border border-ink"
        animate={reduceMotion ? undefined : { scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      />
      {[0, 1, 2, 3].map((drop) => (
        <motion.span
          key={drop}
          className="absolute h-3 w-px bg-maroon"
          style={{ left: `${38 + drop * 8}%` }}
          animate={reduceMotion ? undefined : { y: [12, 86], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: drop * 0.18 }}
        />
      ))}
    </div>
  );
}

export function BookstoreScene() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-40 overflow-hidden border border-ink/15 md:h-48" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute bottom-8 border border-ink bg-paper"
          style={{
            width: 22,
            height: 34 + index * 4,
            left: 28 + index * 26
          }}
          initial={{ y: -40, rotate: -12 }}
          animate={
            reduceMotion
              ? { y: 0, rotate: index === 2 ? -80 : 0 }
              : {
                  y: [ -40, 8, 0],
                  rotate: index === 2 ? [-12, 8, -78] : [-8, 4, 0]
                }
          }
          transition={{ delay: 0.15 * index, type: "spring", stiffness: 260, damping: 14 }}
        />
      ))}
      <motion.div
        className="absolute bottom-0 right-2 w-16"
        animate={reduceMotion ? undefined : { x: [-8, 6, -8] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      >
        <LineCharacter pose={reduceMotion ? "idle" : "run"} carry="books" duration={0.5} />
      </motion.div>
    </div>
  );
}

export function JavaScene() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-40 overflow-hidden border border-ink/15 md:h-48" aria-hidden="true">
      {["OOP", "API", "DB"].map((label, index) => (
        <motion.span
          key={label}
          className="absolute border border-ink bg-paper px-3 py-2 text-[11px] uppercase tracking-[0.12em]"
          style={{ left: 16 + index * 72, top: 28 }}
          animate={
            reduceMotion
              ? undefined
              : { y: [10, 0], rotate: [index % 2 ? 6 : -6, 0] }
          }
          transition={{ type: "spring", delay: index * 0.12 }}
        >
          {label}
        </motion.span>
      ))}
      <motion.div className="absolute bottom-0 left-[36%] w-16">
        <LineCharacter pose={reduceMotion ? "idle" : "push"} />
      </motion.div>
    </div>
  );
}
