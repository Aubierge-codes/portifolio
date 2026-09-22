import type { Variants } from "framer-motion";

export const spring = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.9
} as const;

export const quickSpring = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.72
} as const;

export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};
