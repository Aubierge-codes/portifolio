"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring
} from "framer-motion";
import { useProgress } from "@react-three/drei";
import { LOGO_PATH } from "@/components/navigation/logo";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { markSiteEntered, useHeroReady } from "@/lib/site-ready";
import { SITE_NAME } from "@/lib/site";

/** Long enough that the loader never flashes on a fast, cached visit. */
const MIN_VISIBLE_MS = 900;
/** Past this the page is shown regardless, so the loader can never trap anyone. */
const HARD_TIMEOUT_MS = 6000;

/**
 * Opening screen: the logo mark draws itself above the name, with a thin
 * progress rule tied to what actually gates the first view (webfonts, the
 * hero scene's first frame, and any three.js assets in flight). It then lifts
 * away and tells the hero to start its intro.
 *
 * Rendered on the server too, so the page never paints unstyled underneath
 * it first. Everything that differs on the client (reduced motion, progress)
 * only changes after mount, so hydration sees identical markup.
 */
export function SiteLoader() {
  const reduceMotion = useReducedMotion();
  const heroReady = useHeroReady();
  const { active: assetsLoading, progress: assetProgress } = useProgress();
  const [mounted, setMounted] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [visible, setVisible] = useState(true);
  const label = useRef<HTMLSpanElement>(null);

  const progress = useSpring(0, { stiffness: 90, damping: 22, mass: 0.6 });
  useMotionValueEvent(progress, "change", (value) => {
    if (label.current)
      label.current.textContent = `${Math.round(value * 100)}%`;
  });

  useEffect(() => {
    setMounted(true);
    let alive = true;
    document.fonts?.ready.then(() => alive && setFontsReady(true));
    const min = window.setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const hard = window.setTimeout(() => setTimedOut(true), HARD_TIMEOUT_MS);
    return () => {
      alive = false;
      window.clearTimeout(min);
      window.clearTimeout(hard);
    };
  }, []);

  // Hold the page still while the overlay is up.
  useEffect(() => {
    if (!visible) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [visible]);

  const assetsDone = !assetsLoading;
  const loaded = fontsReady && heroReady && assetsDone;
  const done = (loaded && minElapsed) || timedOut;

  // Weighted toward the hero, the slowest and most visible piece.
  useEffect(() => {
    if (!mounted) return;
    const assets = assetsLoading ? assetProgress / 100 : 1;
    const target = done
      ? 1
      : 0.08 + (fontsReady ? 0.3 : 0) + (heroReady ? 0.47 : 0) + assets * 0.1;
    progress.set(target);
  }, [
    mounted,
    done,
    fontsReady,
    heroReady,
    assetsLoading,
    assetProgress,
    progress
  ]);

  // Leave once the rule has visibly reached the end.
  useEffect(() => {
    if (!done) return;
    const leave = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? 0 : 320
    );
    return () => window.clearTimeout(leave);
  }, [done, reduceMotion]);

  const draw = mounted && !reduceMotion;

  return (
    <AnimatePresence onExitComplete={markSiteEntered}>
      {visible ? (
        <motion.div
          key="site-loader"
          data-site-loader=""
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-paper"
          initial={false}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.3 } }
              : {
                  opacity: 0,
                  y: -18,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                }
          }
        >
          <span className="sr-only">Loading {SITE_NAME}</span>
          <div className="flex flex-col items-center" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              fill="none"
              width={64}
              height={64}
              className="overflow-visible"
            >
              <motion.path
                d={LOGO_PATH}
                stroke="#111110"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                // Hidden at zero length: a round cap would otherwise show a dot.
                initial={{ pathLength: 0, opacity: 0 }}
                animate={mounted ? { pathLength: 1, opacity: 1 } : undefined}
                transition={
                  draw
                    ? { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
                    : { duration: 0 }
                }
              />
              <motion.circle
                cx="50"
                cy="50"
                r="3.4"
                fill="#EB5A3C"
                initial={{ opacity: 0 }}
                animate={mounted ? { opacity: 1 } : undefined}
                transition={
                  draw ? { delay: 0.95, duration: 0.35 } : { duration: 0 }
                }
              />
            </svg>
            <p className="mt-3 font-heading text-[15px] leading-none tracking-[0.01em] text-ink">
              {SITE_NAME}
            </p>
            <div className="mt-6 h-px w-36 overflow-hidden bg-ink/10">
              <motion.div
                className="h-full origin-left bg-maroon"
                style={{ scaleX: progress }}
              />
            </div>
            <span
              ref={label}
              className="mt-3 text-[11px] leading-none tracking-[0.16em] text-ink/45 tabular-nums"
            >
              0%
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
