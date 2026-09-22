"use client";

import { useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LineCharacter } from "@/components/characters/line-character";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { BouncingBall } from "@/components/motion/bouncing-ball";
import type { CharacterPose } from "@/components/characters/line-character";
import type { ProcessStep, TranslationKey } from "@/types/content";

type ProcessSectionProps = {
  t: (key: TranslationKey) => string;
  steps: ProcessStep[];
};

const poses: CharacterPose[] = ["look", "idle", "push", "kick", "walk", "run"];

export function ProcessSection({ t, steps }: ProcessSectionProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [inView, reduceMotion, steps.length]);

  return (
    <section id="process" className="section-shell py-24 md:py-32" ref={ref}>
      <Reveal
        stagger
        className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_0.44fr] lg:items-end"
      >
        <RevealItem>
          <div className="mb-4 flex items-center gap-3">
            <p className="eyebrow text-maroon">{t("process.eyebrow")}</p>
            <BouncingBall size={16} />
          </div>
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

      <div className="relative mb-10 h-44 overflow-hidden border border-ink/15">
        <div className="absolute inset-x-6 bottom-8 h-px bg-ink/20" />
        <motion.div
          className="absolute bottom-0 w-20"
          animate={{
            left: `${6 + active * (80 / Math.max(steps.length - 1, 1))}%`
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <LineCharacter
            pose={reduceMotion ? "idle" : poses[active]}
            carry={active === 0 ? "note" : active === 5 ? "laptop" : "none"}
            duration={0.42}
          />
        </motion.div>
        {active === 3 ? (
          <motion.span
            className="absolute right-8 top-6 font-heading text-4xl text-maroon"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            ×
          </motion.span>
        ) : null}
      </div>

      <div className="grid border-y border-ink md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <button
            key={step.number}
            type="button"
            className={`min-h-64 border-b border-ink p-5 text-left md:border-r ${
              active === index ? "bg-ink text-paper" : "bg-paper"
            }`}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <p className={`eyebrow ${active === index ? "text-paper/70" : "text-maroon"}`}>
              {step.number}
            </p>
            <h3 className="mt-5 font-heading text-3xl font-medium leading-tight">
              {step.title}
            </h3>
            <p
              className={`mt-4 text-base leading-7 ${
                active === index ? "text-paper/75" : "text-ink/72"
              }`}
            >
              {step.body}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
