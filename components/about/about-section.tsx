"use client";

import { motion } from "framer-motion";
import { LineCharacter } from "@/components/characters/line-character";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

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
        {/* Exhibition rail: native horizontal scroll with snap, no scroll-jacking.
            Entries are exactly the verified list in data/translations.ts. */}
        <ol
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]"
          aria-label={t("achievements.title")}
        >
          {achievements.map((item, i) => (
            <li
              key={item}
              tabIndex={0}
              className="flex min-h-[168px] w-[232px] shrink-0 snap-start flex-col justify-between border border-ink/10 bg-[#f4f1ec] p-5 outline-offset-2"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-maroon">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-[19px] leading-snug text-ink">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
