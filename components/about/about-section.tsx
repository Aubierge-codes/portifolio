"use client";

import { motion, useReducedMotion } from "framer-motion";
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
      <Reveal stagger className="grid gap-10 lg:grid-cols-[0.72fr_0.42fr] lg:items-center">
        <div>
          <RevealItem>
            <p className="eyebrow mb-4 text-maroon">{t("about.eyebrow")}</p>
            <AnimatedText value={t("about.title")} as="h2" className="heading-lg" />
          </RevealItem>
          <RevealItem>
            <AnimatedText value={t("about.copy")} as="p" className="body-large mt-7 text-ink/72" />
          </RevealItem>
          <RevealItem>
            <AnimatedText value={t("about.note")} as="p" className="body-large mt-5 text-ink/72" />
          </RevealItem>
          <RevealItem>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {achievements.map((item) => (
                <p key={item} className="border-l-2 border-maroon pl-3 text-sm font-medium">
                  {item}
                </p>
              ))}
            </div>
          </RevealItem>
        </div>
        <RevealItem>
          <div className="relative min-h-[360px] border-2 border-ink bg-paper p-6 shadow-editorial">
            <p className="eyebrow text-maroon">Learning loop</p>
            <div className="absolute inset-x-8 bottom-10 top-20 border border-ink/20">
              {[0, 1, 2, 3].map((item) => (
                <motion.span
                  key={item}
                  className="absolute h-8 w-8 border-2 border-ink bg-paper"
                  style={{
                    left: `${18 + item * 18}%`,
                    top: `${18 + (item % 2) * 38}%`
                  }}
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          y: [0, -10, 0],
                          rotate: [0, item % 2 ? -6 : 6, 0]
                        }
                  }
                  transition={{
                    duration: 2.4 + item * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
              <motion.span
                className="absolute left-[18%] top-[45%] h-2 w-[58%] bg-maroon"
                animate={reduceMotion ? undefined : { scaleX: [0.2, 1, 0.2] }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
