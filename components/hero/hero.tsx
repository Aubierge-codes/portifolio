"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/motion/animated-text";
import { MotionButton } from "@/components/motion/motion-button";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { SignatureMark } from "@/components/hero/signature-mark";
import type { TranslationKey } from "@/types/content";

type HeroProps = {
  t: (key: TranslationKey) => string;
};

export function Hero({ t }: HeroProps) {
  return (
    <section id="top" className="section-shell min-h-screen pt-32 md:pt-40">
      <Reveal
        stagger
        className="grid min-h-[calc(100vh-10rem)] items-center gap-12 lg:grid-cols-[1.08fr_0.82fr]"
      >
        <div>
          <RevealItem>
            <p className="eyebrow mb-5 text-maroon">{t("hero.eyebrow")}</p>
          </RevealItem>
          <RevealItem>
            <AnimatedText value={t("hero.title")} as="h1" className="heading-xl max-w-[880px]" />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("hero.copy")}
              as="p"
              className="body-large mt-7 max-w-[650px] text-ink/72"
            />
          </RevealItem>
          <RevealItem>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <MotionButton href="#work">{t("hero.primary")}</MotionButton>
              <MotionButton href="#about" variant="secondary">
                {t("hero.secondary")}
              </MotionButton>
            </div>
          </RevealItem>
        </div>
        <RevealItem>
          <div className="flex justify-center lg:justify-end">
            <SignatureMark />
          </div>
        </RevealItem>
      </Reveal>
      <motion.a
        href="#work"
        aria-label={t("hero.scroll")}
        className="mb-8 inline-flex h-14 w-9 items-start justify-center border border-ink p-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="mt-1 h-3 w-3 bg-maroon" />
      </motion.a>
    </section>
  );
}
