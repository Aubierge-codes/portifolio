"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LineCharacter } from "@/components/characters/line-character";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { TranslationKey } from "@/types/content";

type AboutSectionProps = {
  t: (key: TranslationKey) => string;
  achievements: string[];
};

export function AboutSection({ t, achievements }: AboutSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="section-shell py-24 md:py-32">
      <Reveal
        stagger
        className="grid gap-12 lg:grid-cols-[0.74fr_0.4fr] lg:items-center"
      >
        <div>
          <RevealItem>
            <p className="eyebrow mb-4 text-maroon">{t("about.eyebrow")}</p>
            <AnimatedText
              value={t("about.title")}
              as="h2"
              className="heading-lg"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("about.copy")}
              as="p"
              className="body-large mt-7 text-ink/72"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("about.note")}
              as="p"
              className="body-large mt-5 text-ink/72"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("about.background")}
              as="p"
              className="body-large mt-5 text-ink/72"
            />
          </RevealItem>
        </div>
        <RevealItem>
          <div className="relative min-h-[340px] border border-ink bg-paper p-4">
            <div className="absolute inset-x-8 bottom-16 h-16 border border-ink/20 bg-paper" />
            <div className="absolute bottom-8 left-1/2 w-28 -translate-x-1/2">
              <LineCharacter
                pose="sit"
                hair="puff"
                carry="laptop"
                paused={Boolean(reduceMotion)}
              />
            </div>
            <motion.span
              className="absolute right-8 top-10 h-2 w-10 bg-ink"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.2, 1, 0.2], scaleX: [0.6, 1, 0.6] }
              }
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <p className="eyebrow text-maroon">{t("achievements.eyebrow")}</p>
          </div>
        </RevealItem>
      </Reveal>
      <div className="mt-16">
        <p className="eyebrow mb-6 text-maroon">{t("achievements.title")}</p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((item) => (
            <li
              key={item}
              className="border-l border-maroon pl-3 text-sm leading-6 text-ink/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
