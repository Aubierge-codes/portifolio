"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CharacterPose =
  | "run"
  | "walk"
  | "idle"
  | "kick"
  | "look"
  | "sit"
  | "push"
  | "think";

export type CarryItem =
  | "none"
  | "laptop"
  | "ball"
  | "flag"
  | "folder"
  | "plant"
  | "books"
  | "note";

export type HairStyle = "short" | "puff" | "bun";

type LineCharacterProps = {
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
  duration = 0.44,
  paused = false,
  look = 0,
  lean = 0,
  className,
  accent = false
}: LineCharacterProps) {
  const reduceMotion = useReducedMotion();
  const running = pose === "run" && !paused && !reduceMotion;
  const walking = pose === "walk" && !paused && !reduceMotion;
  const cycle = running ? duration : walking ? duration * 1.45 : 0;
  const move = running || walking;
  const kick = pose === "kick";
  const sit = pose === "sit" || pose === "think";

  return (
    <svg
      viewBox="0 0 90 140"
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
                y: move ? [0, -4, 0] : pose === "idle" ? [0, -1.5, 0] : 0
              }
        }
        transition={
          move
            ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }
        }
        style={{ transformOrigin: "45px 78px" }}
      >
        <motion.g
          animate={{ rotate: look + (pose === "look" ? 18 : 0) }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          style={{ transformOrigin: "45px 28px" }}
        >
          {hair === "puff" ? (
            <ellipse
              cx="45"
              cy="20"
              rx="16"
              ry="14"
              stroke="#030303"
              strokeWidth="2.4"
            />
          ) : hair === "bun" ? (
            <>
              <circle
                cx="58"
                cy="16"
                r="6"
                stroke="#030303"
                strokeWidth="2.4"
              />
              <circle
                cx="45"
                cy="22"
                r="13"
                stroke="#030303"
                strokeWidth="2.4"
              />
            </>
          ) : (
            <circle cx="45" cy="22" r="12" stroke="#030303" strokeWidth="2.4" />
          )}
          <circle cx="41" cy="21" r="1.3" fill="#030303" />
          <circle cx="50" cy="21" r="1.3" fill="#030303" />
          <path
            d="M41 27.5 C44 29.5, 48 29.5, 51 27.5"
            stroke="#030303"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.g>

        <path
          d="M45 35 L45 78"
          stroke="#030303"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {accent ? (
          <path
            d="M38 48 H52"
            stroke="#6E1F24"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ) : null}

        <motion.g
          style={{ transformOrigin: "45px 42px" }}
          animate={
            kick
              ? { rotate: [-12, 28, -8] }
              : sit
                ? { rotate: 42 }
                : move
                  ? { rotate: [22, -26, 22] }
                  : { rotate: pose === "push" ? 28 : -8 }
          }
          transition={
            move
              ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
              : { duration: kick ? 0.42 : 0.5, ease: "easeInOut" }
          }
        >
          <path
            d="M45 42 L18 58"
            stroke="#030303"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "45px 42px" }}
          animate={
            sit
              ? { rotate: -50 }
              : move
                ? { rotate: [-24, 24, -24] }
                : { rotate: pose === "push" ? -18 : 12 }
          }
          transition={
            move
              ? {
                  duration: cycle,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + cycle / 2
                }
              : { duration: 0.5 }
          }
        >
          <path
            d="M45 42 L72 56"
            stroke="#030303"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <Carry carry={carry} />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "45px 78px" }}
          animate={
            kick
              ? { rotate: [8, -42, 6] }
              : sit
                ? { rotate: -70 }
                : move
                  ? { rotate: [-28, 30, -28] }
                  : { rotate: 8 }
          }
          transition={
            move
              ? { duration: cycle, repeat: Infinity, ease: "easeInOut", delay }
              : { duration: kick ? 0.4 : 0.45, ease: [0.2, 0.8, 0.2, 1] }
          }
        >
          <path
            d="M45 78 L28 118"
            stroke="#030303"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M28 118 L21 118"
            stroke="#030303"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          style={{ transformOrigin: "45px 78px" }}
          animate={
            kick
              ? { rotate: [-10, 38, -6] }
              : sit
                ? { rotate: 18 }
                : move
                  ? { rotate: [26, -26, 26] }
                  : { rotate: -10 }
          }
          transition={
            move
              ? {
                  duration: cycle,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + cycle / 2
                }
              : { duration: kick ? 0.4 : 0.45 }
          }
        >
          <path
            d="M45 78 L62 118"
            stroke="#030303"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M62 118 L70 118"
            stroke="#030303"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}

function Carry({ carry }: { carry: CarryItem }) {
  if (carry === "none") return null;

  if (carry === "laptop") {
    return (
      <g transform="translate(66 48)">
        <rect
          x="0"
          y="0"
          width="18"
          height="12"
          stroke="#030303"
          strokeWidth="1.8"
        />
        <path d="M-2 12 H20" stroke="#030303" strokeWidth="1.8" />
        <rect x="12" y="3" width="4" height="3" fill="#6E1F24" />
      </g>
    );
  }

  if (carry === "ball") {
    return <circle cx="74" cy="58" r="7" stroke="#030303" strokeWidth="2" />;
  }

  if (carry === "flag") {
    return (
      <g transform="translate(70 34)">
        <path d="M0 0 V28" stroke="#030303" strokeWidth="1.8" />
        <path d="M0 0 H16 L12 8 L16 16 H0" fill="#6E1F24" />
        <text x="3" y="11" fontSize="6" fill="#FFFFFF">
          {"</>"}
        </text>
      </g>
    );
  }

  if (carry === "folder") {
    return (
      <g transform="translate(66 46)">
        <path
          d="M0 4 H6 L8 0 H20 V16 H0 Z"
          stroke="#030303"
          strokeWidth="1.8"
          fill="#FFFFFF"
        />
        <path d="M2 8 H18" stroke="#6E1F24" strokeWidth="1.4" />
      </g>
    );
  }

  if (carry === "plant") {
    return (
      <g transform="translate(68 46)">
        <rect
          x="4"
          y="10"
          width="10"
          height="8"
          stroke="#030303"
          strokeWidth="1.6"
        />
        <path
          d="M9 10 C4 2, 14 -2, 12 8"
          stroke="#030303"
          strokeWidth="1.6"
          fill="none"
        />
        <circle cx="12" cy="2" r="2.2" fill="#6E1F24" />
      </g>
    );
  }

  if (carry === "books") {
    return (
      <g transform="translate(66 48)">
        <rect
          x="0"
          y="2"
          width="8"
          height="14"
          stroke="#030303"
          strokeWidth="1.6"
        />
        <rect
          x="8"
          y="0"
          width="8"
          height="16"
          stroke="#030303"
          strokeWidth="1.6"
        />
        <path d="M10 4 V12" stroke="#6E1F24" strokeWidth="1.2" />
      </g>
    );
  }

  return (
    <g transform="translate(68 48)">
      <rect
        x="0"
        y="0"
        width="14"
        height="16"
        stroke="#030303"
        strokeWidth="1.6"
      />
      <path d="M3 4 H11 M3 8 H9" stroke="#030303" strokeWidth="1.2" />
    </g>
  );
}
