"use client";

import { motion } from "framer-motion";
import { revealVariants, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "li";
  stagger?: boolean;
};

export function Reveal({
  children,
  className,
  as = "div",
  stagger = false
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      variants={
        reduceMotion ? undefined : stagger ? staggerContainer : revealVariants
      }
      initial={reduceMotion ? { opacity: 0 } : "hidden"}
      whileInView={reduceMotion ? { opacity: 1 } : "visible"}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduceMotion ? { duration: 0.18 } : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={reduceMotion ? undefined : revealVariants}
      transition={reduceMotion ? { duration: 0.18 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
