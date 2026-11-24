"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { ProcessStep, TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ProcessSectionProps = {
  t: (key: TranslationKey) => string;
  steps: ProcessStep[];
};

/**
 * The six steps, grouped into the four acts of how the work actually moves:
 * think, design, build, improve. One maroon line draws across the acts as the
 * section scrolls past. No 3D here: this section rests the eyes
 * (DESIGN_BLUEPRINT.md §3.5).
 */
const ACTS: { key: TranslationKey; steps: number[] }[] = [
  { key: "process.think", steps: [0] },
  { key: "process.design", steps: [1] },
  { key: "process.build", steps: [2, 3] },
  { key: "process.improve", steps: [4, 5] }
];

export function ProcessSection({ t, steps }: ProcessSectionProps) {
  const reduceMotion = useReducedMotion();
  const band = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: band,
    offset: ["start 85%", "end 60%"]
  });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="section-shell py-24 md:py-32">
      <Reveal
        stagger
        className="mb-14 grid gap-6 lg:grid-cols-[0.7fr_0.44fr] lg:items-end"
      >
        <RevealItem>
          <p className="eyebrow mb-4 text-maroon">{t("process.eyebrow")}</p>
          <AnimatedText
            value={t("process.title")}
            as="h2"
            className="heading-lg"
          />
        </RevealItem>
        <RevealItem>
          <AnimatedText
            value={t("process.copy")}
            as="p"
            className="body-large text-ink/70"
          />
        </RevealItem>
      </Reveal>

      <div ref={band} className="relative">
        <div
          className="absolute inset-x-0 top-0 h-px bg-ink/15"
          aria-hidden="true"
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-maroon"
          style={{ scaleX: reduceMotion ? 1 : line }}
          aria-hidden="true"
        />
        <ol className="grid gap-x-8 gap-y-12 pt-8 md:grid-cols-2 lg:grid-cols-4">
          {ACTS.map((act, i) => (
            <li key={act.key}>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-maroon">
                {String(i + 1).padStart(2, "0")} · {t(act.key)}
              </p>
              <div className="mt-5 grid gap-7">
                {act.steps.map((s) => {
                  const step = steps[s];
                  if (!step) return null;
                  return (
                    <div key={step.number}>
                      <h3 className="font-heading text-2xl font-medium leading-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base leading-7 text-ink/70">
                        {step.body}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {step.skills.map((skill) => (
                          <li
                            key={skill}
                            className="border border-ink/15 px-2 py-0.5 font-mono text-[11px] tracking-[0.04em] text-ink/65"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
