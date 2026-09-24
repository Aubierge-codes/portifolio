"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { quickSpring } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type SpringButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "paper";
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  hit?: boolean;
};

export function SpringButton({
  href,
  children,
  variant = "primary",
  className,
  ariaLabel,
  onClick,
  type = "button",
  hit = false
}: SpringButtonProps) {
  const reduceMotion = useReducedMotion();
  const classes = cn(
    "relative inline-flex min-h-11 items-center justify-center overflow-hidden border px-5 py-2.5 text-sm transition-colors",
    variant === "primary" &&
      "border-ink bg-ink text-paper hover:border-maroon hover:bg-maroon",
    variant === "secondary" &&
      "border-ink bg-paper text-ink hover:border-maroon hover:text-maroon",
    variant === "paper" && "border-paper bg-paper text-ink hover:text-maroon",
    className
  );

  const motionProps = {
    animate: reduceMotion
      ? undefined
      : hit
        ? {
            scaleX: [1, 1.12, 0.94, 1.04, 1],
            scaleY: [1, 0.86, 1.1, 0.98, 1]
          }
        : undefined,
    whileHover: reduceMotion
      ? undefined
      : { y: -2, scaleX: 1.03, scaleY: 0.98 },
    whileTap: reduceMotion ? undefined : { y: 2, scaleX: 0.96, scaleY: 0.92 },
    transition: quickSpring
  };

  if (href) {
    return (
      <motion.div className="inline-flex" {...motionProps}>
        <Link
          href={href}
          aria-label={ariaLabel}
          className={classes}
          onClick={onClick}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
