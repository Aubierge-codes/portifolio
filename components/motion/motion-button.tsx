"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { quickSpring } from "@/lib/motion";

type MotionButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  className?: string;
  ariaLabel?: string;
};

export function MotionButton({
  href,
  children,
  variant = "primary",
  className,
  ariaLabel
}: MotionButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -2,
              scaleX: 1.025,
              scaleY: 0.985
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              y: 2,
              scaleX: 0.97,
              scaleY: 0.94
            }
      }
      transition={quickSpring}
      className="inline-flex"
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className={cn(
          "group relative inline-flex min-h-11 items-center justify-center overflow-hidden border px-5 py-2.5 text-sm font-medium transition-colors",
          "focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-maroon",
          variant === "primary" &&
            "border-ink bg-ink text-paper shadow-editorial-soft hover:border-maroon hover:bg-maroon",
          variant === "secondary" &&
            "border-ink bg-paper text-ink hover:border-maroon hover:text-maroon",
          variant === "quiet" &&
            "border-transparent bg-transparent px-1 text-ink hover:text-maroon",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        {variant !== "quiet" ? (
          <span className="absolute bottom-0 left-0 h-1 w-0 bg-maroon transition-all duration-300 group-hover:w-full" />
        ) : null}
      </Link>
    </motion.div>
  );
}
