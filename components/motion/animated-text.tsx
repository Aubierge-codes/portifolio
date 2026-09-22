"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion";

type AnimatedTextProps = {
  value: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  className?: string;
};

export function AnimatedText({
  value,
  as: Tag = "span",
  className
}: AnimatedTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.985 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
        transition={reduceMotion ? { duration: 0.12 } : spring}
        className="block"
      >
        <Tag className={className}>{value}</Tag>
      </motion.span>
    </AnimatePresence>
  );
}
