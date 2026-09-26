import type { Transition, Variants } from "framer-motion";

export const spring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 22,
  mass: 0.9
};

export const quickSpring: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.72
};

export const bounceSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 14,
  mass: 0.8
};

export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};
