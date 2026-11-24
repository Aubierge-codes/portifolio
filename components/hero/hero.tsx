"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { SpringButton } from "@/components/motion/spring-button";
import { AnimatedText } from "@/components/motion/animated-text";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useHeroReady, useSiteEntered } from "@/lib/site-ready";
import { cn } from "@/lib/utils";

const HeroCanvas = dynamic(
  () => import("@/components/three/hero-canvas").then((mod) => mod.HeroCanvas),
  // The poster still behind the canvas covers the load.
  { ssr: false, loading: () => null }
);

type HeroProps = {
  t: (key: TranslationKey) => string;
};

type Phase = "enter" | "run" | "look" | "kick" | "cta" | "rest";

export function Hero({ t }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // The intro waits for the loader to lift, so it plays where it can be seen.
  const entered = useSiteEntered();
  const heroReady = useHeroReady();
  const [phase, setPhase] = useState<Phase>(reduceMotion ? "rest" : "enter");
  const { scrollY } = useScroll();
  const sceneY = useTransform(scrollY, [0, 480], [0, 18]);
  const bgY = useTransform(scrollY, [0, 480], [0, 8]);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("rest");
      return;
    }
    if (!entered) return;
    const timers = [
      window.setTimeout(() => setPhase("run"), 420),
      window.setTimeout(() => setPhase("look"), 2400),
      window.setTimeout(() => setPhase("kick"), 3100),
      window.setTimeout(() => setPhase("cta"), 3480),
      window.setTimeout(() => setPhase("rest"), 4300)
    ];
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion, entered]);

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

      <div className="section-shell relative z-10 grid min-h-[58vh] items-center lg:min-h-[62vh]">
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
          </div>
        </div>
      </div>

      {/* The workstation: full-bleed behind the copy on wide screens, below it
          on phones. A Blender still of the same scene shows until the live
          scene has drawn, and stays for reduced motion or no WebGL. */}
      <motion.div
        className="pointer-events-none relative z-0 mt-2 h-[46svh] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto"
        style={reduceMotion ? undefined : { y: sceneY }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/posters/hero.jpg"
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-[70%_60%] transition-opacity duration-700 lg:object-[30%_50%]",
            heroReady && !reduceMotion ? "opacity-0" : "opacity-100"
          )}
        />
        <HeroCanvas isMobile={isMobile} />
      </motion.div>
    </section>
  );
}
