"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { LineCharacter } from "@/components/characters/line-character";
import { BouncingBall } from "@/components/motion/bouncing-ball";
import { SpringButton } from "@/components/motion/spring-button";
import { AnimatedText } from "@/components/motion/animated-text";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TranslationKey } from "@/types/content";

type HeroProps = {
  t: (key: TranslationKey) => string;
};

type Phase = "enter" | "run" | "look" | "kick" | "cta" | "rest";

export function Hero({ t }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "rest" : "enter");
  const { scrollY } = useScroll();
  const characterY = useTransform(scrollY, [0, 480], [0, 28]);
  const bgY = useTransform(scrollY, [0, 480], [0, 12]);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("rest");
      return;
    }
    const timers = [
      window.setTimeout(() => setPhase("run"), 420),
      window.setTimeout(() => setPhase("look"), 2400),
      window.setTimeout(() => setPhase("kick"), 3100),
      window.setTimeout(() => setPhase("cta"), 3480),
      window.setTimeout(() => setPhase("rest"), 4300)
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  const running = phase === "run" || phase === "look" || phase === "rest";
  const kicked = phase === "kick" || phase === "cta" || phase === "rest";

  return (
    <section
      id="top"
      className="relative min-h-[100svh] overflow-hidden pt-28 md:pt-32"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={reduceMotion ? undefined : { y: bgY }}
      >
        <div className="absolute left-[8%] top-[22%] h-px w-[18%] bg-ink/10" />
        <div className="absolute right-[12%] top-[18%] h-24 w-px bg-ink/10" />
      </motion.div>

      <div className="section-shell relative z-10 grid min-h-[72vh] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="max-w-[860px]">
          <p className="eyebrow mb-5 text-maroon">{t("hero.eyebrow")}</p>
          <AnimatedText
            value={t("hero.title")}
            as="h1"
            className="heading-xl"
          />
          <AnimatedText
            value={t("hero.copy")}
            as="p"
            className="body-large mt-7 max-w-[640px] text-ink/72"
          />
          <div className="relative mt-9 flex flex-wrap items-center gap-4">
            <SpringButton href="#work" hit={phase === "cta"}>
              {t("hero.primary")}
            </SpringButton>
            <SpringButton href="#about" variant="secondary">
              {t("hero.secondary")}
            </SpringButton>
            {kicked && phase === "cta" ? (
              <span className="absolute -right-2 top-full mt-6 hidden sm:block">
                <BouncingBall animate={false} />
              </span>
            ) : null}
            {phase === "rest" ? (
              <span className="absolute -right-2 top-full mt-6 hidden sm:block">
                <BouncingBall animate />
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] md:h-[260px]"
        style={reduceMotion ? undefined : { y: characterY }}
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-[42px] h-px bg-ink/15" />
        <HeroRunners
          phase={phase}
          running={running}
          isMobile={isMobile}
          reduceMotion={Boolean(reduceMotion)}
        />
        <motion.div
          className="absolute bottom-[48px]"
          initial={{ x: "18%", y: 0, scale: 1 }}
          animate={
            reduceMotion
              ? { x: "72%", y: 0 }
              : kicked
                ? {
                    x: ["38%", "62%", "68%"],
                    y: [0, -64, 18],
                    scaleX: [1, 1.18, 0.86, 1],
                    scaleY: [1, 0.82, 1.16, 1]
                  }
                : { x: "32%", y: 0 }
          }
          transition={{ duration: 0.72, ease: [0.2, 0.8, 0.22, 1] }}
        >
          {phase === "kick" || phase === "enter" || phase === "run" || phase === "look" ? (
            <BouncingBall animate={false} layoutId={kicked ? undefined : "story-ball"} />
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroRunners({
  phase,
  running,
  isMobile,
  reduceMotion
}: {
  phase: Phase;
  running: boolean;
  isMobile: boolean;
  reduceMotion: boolean;
}) {
  const pose =
    phase === "kick" ? "kick" : phase === "look" ? "look" : running ? "run" : "run";

  if (isMobile || reduceMotion) {
    return (
      <motion.div
        className="absolute bottom-2 w-24"
        initial={{ x: "-12%" }}
        animate={{ x: reduceMotion ? "42%" : ["-12%", "78%"] }}
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : { duration: 7.5, repeat: Infinity, ease: "linear" }
        }
      >
        <LineCharacter pose={reduceMotion ? "idle" : "run"} carry="laptop" duration={0.4} />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="absolute bottom-2 w-28"
        initial={{ x: "-20%" }}
        animate={{
          x: phase === "enter" ? "-8%" : ["-8%", "92%"]
        }}
        transition={{
          duration: phase === "enter" ? 0.8 : 8.4,
          repeat: phase === "enter" ? 0 : Infinity,
          ease: phase === "enter" ? "easeOut" : "linear"
        }}
      >
        <LineCharacter
          pose={pose === "kick" ? "kick" : "run"}
          carry="none"
          duration={0.38}
          lean={phase === "enter" ? -12 : 8}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-2 w-28"
        initial={{ x: "-32%" }}
        animate={{ x: ["-18%", "88%"] }}
        transition={{ duration: 9.1, repeat: Infinity, ease: "linear", delay: 0.45 }}
      >
        <LineCharacter
          pose={running ? "run" : "run"}
          carry="laptop"
          hair="puff"
          duration={0.46}
          delay={0.08}
          accent
        />
      </motion.div>
      <motion.div
        className="absolute bottom-2 w-28"
        initial={{ x: "-40%" }}
        animate={{ x: ["-24%", "84%"] }}
        transition={{ duration: 9.8, repeat: Infinity, ease: "linear", delay: 0.9 }}
      >
        <LineCharacter
          pose={phase === "look" ? "look" : "run"}
          carry="flag"
          hair="bun"
          duration={0.5}
          delay={0.12}
          look={phase === "look" ? 16 : 0}
        />
      </motion.div>
    </>
  );
}
