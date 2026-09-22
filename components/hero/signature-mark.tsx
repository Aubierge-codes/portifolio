"use client";

import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";

export function SignatureMark() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative h-[260px] w-full max-w-[420px] overflow-hidden border-2 border-ink bg-paper shadow-editorial md:h-[360px]"
      aria-hidden="true"
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 border-2 border-ink bg-paper md:h-36 md:w-36"
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { scaleX: 0.55, scaleY: 1.18, rotate: -8 }
        }
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                scaleX: [0.55, 0.72, 1.2, 0.94, 1],
                scaleY: [1.18, 0.82, 1.08, 0.96, 1],
                rotate: [-8, -12, 7, -2, 0],
                y: [14, 18, -16, 4, 0]
              }
        }
        transition={{ ...spring, delay: 0.35 }}
      />
      <motion.div
        className="absolute left-[22%] top-[24%] h-12 w-32 bg-ink md:w-40"
        initial={reduceMotion ? { opacity: 0 } : { x: -80, scaleX: 0.4 }}
        animate={reduceMotion ? { opacity: 1 } : { x: 0, scaleX: 1 }}
        transition={{ ...spring, delay: 0.52 }}
      />
      <motion.div
        className="absolute bottom-[24%] right-[18%] h-12 w-32 bg-maroon md:w-44"
        initial={reduceMotion ? { opacity: 0 } : { x: 80, scaleX: 0.4 }}
        animate={reduceMotion ? { opacity: 1 } : { x: 0, scaleX: 1 }}
        transition={{ ...spring, delay: 0.62 }}
      />
      <motion.div
        className="absolute left-[18%] top-[56%] h-10 w-10 border-2 border-ink bg-paper"
        animate={
          reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 7, 0] }
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] top-[18%] h-8 w-8 bg-maroon"
        animate={
          reduceMotion ? undefined : { y: [0, 8, 0], scale: [1, 0.94, 1] }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-8 bottom-8 h-px bg-ink/25" />
      <motion.div
        className="absolute bottom-7 left-8 h-2 w-16 bg-ink"
        animate={reduceMotion ? undefined : { x: [0, 190, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
