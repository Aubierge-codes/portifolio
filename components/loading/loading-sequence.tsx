"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { quickSpring, spring } from "@/lib/motion";

type LoadingSequenceProps = {
  skipLabel: string;
};

export function LoadingSequence({ skipLabel }: LoadingSequenceProps) {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 450 : 1350
    );
    return () => window.clearTimeout(timeout);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-paper text-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -16 }}
          transition={{ duration: 0.28 }}
          role="status"
          aria-live="polite"
        >
          <button
            className="absolute right-5 top-5 text-sm underline decoration-maroon underline-offset-4"
            onClick={() => setVisible(false)}
          >
            {skipLabel}
          </button>
          <motion.div
            aria-hidden="true"
            className="relative grid h-28 w-28 place-items-center border-2 border-ink bg-paper shadow-editorial"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { scaleX: 0.45, scaleY: 1.24, y: 10 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    scaleX: [0.45, 0.72, 1.18, 0.96, 1],
                    scaleY: [1.24, 0.82, 1.08, 0.98, 1],
                    y: [10, 14, -12, 4, 0],
                    rotate: [-3, -6, 4, -1, 0]
                  }
            }
            transition={
              reduceMotion ? { duration: 0.2 } : { ...spring, duration: 1 }
            }
          >
            <motion.span
              className="font-heading text-6xl font-medium"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{ ...quickSpring, repeat: 1, repeatType: "mirror" }}
            >
              A
            </motion.span>
            <motion.span
              className="absolute -right-3 top-4 h-4 w-8 bg-maroon"
              animate={
                reduceMotion
                  ? undefined
                  : { x: [-10, 4, 0], scaleX: [0.5, 1.2, 1] }
              }
              transition={spring}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
