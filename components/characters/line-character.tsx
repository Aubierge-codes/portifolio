"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type CharacterPose =
  "run" | "walk" | "idle" | "kick" | "look" | "sit" | "push" | "think";

export type CarryItem =
  "none" | "laptop" | "ball" | "flag" | "folder" | "plant" | "books" | "note";

export type HairStyle = "short" | "puff" | "bun";

export type LineCharacterProps = {
  pose?: CharacterPose;
  carry?: CarryItem;
  hair?: HairStyle;
  delay?: number;
  duration?: number;
  paused?: boolean;
  look?: number;
  lean?: number;
  className?: string;
  accent?: boolean;
};

export function LineCharacter({
  pose = "run",
  carry = "none",
  hair = "short",
  delay = 0,
  duration = 0.52,
  paused = false,
  look = 0,
  lean = 0,
  className,
  accent = false
}: LineCharacterProps) {
  const reduceMotion = useReducedMotion();
  const running = pose === "run" && !paused && !reduceMotion;
  const walking = pose === "walk" && !paused && !reduceMotion;
  const cycle = running ? duration : walking ? duration * 1.28 : 0;
  const move = running || walking;
  const kick = pose === "kick";
  const sit = pose === "sit" || pose === "think";
  const swing = move ? (running ? 16 : 11) : 0;

  return (
    <svg
      viewBox="0 0 72 152"
      fill="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <motion.g
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: lean,
                y: move ? [0, -1.4, 0] : pose === "idle" ? [0, -0.7, 0] : 0
              }
        }
        transition={
          move
            ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }
        }
        style={{ transformOrigin: "36px 70px" }}
      >
        <motion.g
          animate={{ rotate: look + (pose === "look" ? 10 : 0) }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ transformOrigin: "36px 14px" }}
        >
          <Hair hair={hair} />
          <ellipse
            cx="36"
            cy="14.5"
            rx="5.6"
            ry="6.5"
            stroke="#030303"
            strokeWidth="1.5"
          />
          <path
            d="M36 21 L36 26.5"
            stroke="#030303"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        </motion.g>

        <path
          d="M23 30 C 29 25.5, 43 25.5, 49 30 L 46.5 67 C 41 70.5, 31 70.5, 25.5 67 Z"
          stroke="#030303"
          strokeWidth="1.55"
          strokeLinejoin="round"
        />
        <path
          d="M36 26.5 L32 43 L36 47 L40 43 Z"
          stroke="#030303"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <path
          d="M36 47 L36 67"
          stroke="#030303"
          strokeWidth="1.05"
          opacity="0.35"
        />
        {accent ? (
          <path
            d="M28 49 H44"
            stroke="#6E1F24"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        ) : null}

        <motion.g
          style={{ transformOrigin: "25px 31px" }}
          animate={
            kick
              ? { rotate: [-8, 18, -6] }
              : sit
                ? { rotate: 38 }
                : move
                  ? { rotate: [swing, -swing, swing] }
                  : { rotate: pose === "push" ? 24 : -7 }
          }
          transition={
            move
              ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
              : { duration: kick ? 0.48 : 0.55, ease: "easeInOut" }
          }
        >
          <path
            d="M25 31 C 22 44, 20 54, 19 64"
            stroke="#030303"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "47px 31px" }}
          animate={
            sit
              ? { rotate: -46 }
              : move
                ? { rotate: [-swing, swing, -swing] }
                : { rotate: pose === "push" ? -16 : 8 }
          }
          transition={
            move
              ? {
                  duration: cycle,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + cycle / 2
                }
              : { duration: 0.55 }
          }
        >
          <path
            d="M47 31 C 51 44, 53 53, 54 64"
            stroke="#030303"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <g transform="translate(52 58)">
            <Carry carry={carry} />
          </g>
        </motion.g>

        <motion.g
          style={{ transformOrigin: "32px 67px" }}
          animate={
            kick
              ? { rotate: [6, -28, 4] }
              : sit
                ? { rotate: -62 }
                : move
                  ? { rotate: [-swing - 2, swing + 4, -swing - 2] }
                  : { rotate: 5 }
          }
          transition={
            move
              ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
              : { duration: kick ? 0.46 : 0.5, ease: [0.22, 0.8, 0.28, 1] }
          }
        >
          <path
            d="M32 67 C 30 90, 29 112, 28 136"
            stroke="#030303"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
          <path
            d="M23 136 C 23 139.5, 32 139.5, 34 136"
            stroke="#030303"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "40px 67px" }}
          animate={
            kick
              ? { rotate: [-8, 32, -4] }
              : sit
                ? { rotate: 14 }
                : move
                  ? { rotate: [swing + 4, -swing - 2, swing + 4] }
                  : { rotate: -6 }
          }
          transition={
            move
              ? {
                  duration: cycle,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + cycle / 2
                }
              : { duration: kick ? 0.46 : 0.5 }
          }
        >
          <path
            d="M40 67 C 42 90, 43 112, 44 136"
            stroke="#030303"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
          <path
            d="M39 136 C 39 139.5, 49 139.5, 50 136"
            stroke="#030303"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function Hair({ hair }: { hair: HairStyle }) {
  if (hair === "puff") {
    return (
      <path
        d="M30 16 C 27.5 7, 36 3.5, 36 11 C 36 3.5, 44.5 7, 42 16"
        stroke="#030303"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    );
  }

  if (hair === "bun") {
    return (
      <>
        <circle
          cx="43.5"
          cy="7.5"
          r="3.1"
          stroke="#030303"
          strokeWidth="1.45"
        />
        <path
          d="M30.5 14.5 C 32 8.5, 40 7.5, 42 12"
          stroke="#030303"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </>
    );
  }

  return (
    <path
      d="M30.4 15 C 31.5 8.4, 40.5 7.6, 41.6 15"
      stroke="#030303"
      strokeWidth="1.45"
      strokeLinecap="round"
    />
  );
}

function Carry({ carry }: { carry: CarryItem }) {
  if (carry === "none") return null;

  if (carry === "laptop") {
    return (
      <g>
        <rect
          x="0"
          y="-7"
          width="15"
          height="9"
          stroke="#030303"
          strokeWidth="1.3"
        />
        <path d="M-1.5 2 H16.5" stroke="#030303" strokeWidth="1.3" />
        <rect x="10" y="-4" width="3" height="2.2" fill="#6E1F24" />
      </g>
    );
  }

  if (carry === "ball") {
    return <circle cx="8" cy="2" r="5.5" stroke="#030303" strokeWidth="1.4" />;
  }

  if (carry === "flag") {
    return (
      <g>
        <path d="M2 -18 V8" stroke="#030303" strokeWidth="1.25" />
        <path d="M2 -18 H15 L12 -11 L15 -4 H2" fill="#6E1F24" />
        <text x="4.5" y="-8" fontSize="5" fill="#FFFFFF">
          {"</>"}
        </text>
      </g>
    );
  }

  if (carry === "folder") {
    return (
      <g>
        <path
          d="M0 -2 H5 L7 -5 H17 V9 H0 Z"
          stroke="#030303"
          strokeWidth="1.3"
          fill="#FFFFFF"
        />
        <path d="M2 2 H15" stroke="#6E1F24" strokeWidth="1.2" />
      </g>
    );
  }

  if (carry === "plant") {
    return (
      <g>
        <rect
          x="4"
          y="2"
          width="8"
          height="7"
          stroke="#030303"
          strokeWidth="1.25"
        />
        <path
          d="M8 2 C 4 -5, 13 -8, 11 0"
          stroke="#030303"
          strokeWidth="1.25"
          fill="none"
        />
        <circle cx="11" cy="-6" r="1.7" fill="#6E1F24" />
      </g>
    );
  }

  if (carry === "books") {
    return (
      <g>
        <rect
          x="0"
          y="-4"
          width="6.5"
          height="12"
          stroke="#030303"
          strokeWidth="1.25"
        />
        <rect
          x="6.5"
          y="-6"
          width="6.5"
          height="14"
          stroke="#030303"
          strokeWidth="1.25"
        />
        <path d="M8.5 -2 V6" stroke="#6E1F24" strokeWidth="1.1" />
      </g>
    );
  }

  return (
    <g>
      <rect
        x="0"
        y="-6"
        width="12"
        height="13"
        stroke="#030303"
        strokeWidth="1.25"
      />
      <path d="M2.5 -2 H9.5 M2.5 2 H8" stroke="#030303" strokeWidth="1.05" />
    </g>
  );
}
