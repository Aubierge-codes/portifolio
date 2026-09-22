"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";

type HerIngressSceneProps = {
  papers: string[];
};

export function HerIngressScene({ papers }: HerIngressSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-48 overflow-hidden border border-ink/15 bg-paper md:h-56"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-6 h-px bg-ink/15" />
      <motion.div
        className="absolute bottom-1 w-24"
        animate={
          reduceMotion
            ? { x: "38%" }
            : inView
              ? { x: ["-20%", "42%", "42%", "88%"] }
              : { x: "-18%" }
        }
        transition={{ duration: 5.6, repeat: Infinity, times: [0, 0.38, 0.62, 1] }}
      >
        <LineCharacter
          pose={inView && !reduceMotion ? "run" : "idle"}
          paused={inView && !reduceMotion ? false : true}
          carry="folder"
          hair="puff"
          duration={0.4}
          look={inView ? 8 : 0}
        />
      </motion.div>
      {papers.map((paper, index) => (
        <motion.span
          key={paper}
          className="absolute top-6 border border-ink bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
          style={{ left: `${12 + index * 18}%` }}
          animate={
            reduceMotion
              ? undefined
              : inView
                ? {
                    x: [0, 18 + index * 6, 54],
                    y: [8 + index * 4, -6, 18],
                    rotate: [-8, 6, -4]
                  }
                : { y: [0, -6, 0], rotate: [-4, 5, -4] }
          }
          transition={{
            duration: 3.4 + index * 0.35,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.12
          }}
        >
          {paper}
        </motion.span>
      ))}
    </div>
  );
}
