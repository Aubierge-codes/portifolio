"use client";

import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { ProcessStep, TranslationKey } from "@/types/content";

type ProcessSectionProps = {
  t: (key: TranslationKey) => string;
  steps: ProcessStep[];
};

export function ProcessSection({ t, steps }: ProcessSectionProps) {
  return (
    <section id="process" className="section-shell py-24 md:py-32">
      <Reveal
        stagger
        className="mb-12 grid gap-6 lg:grid-cols-[0.7fr_0.44fr] lg:items-end"
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
      <Reveal
        stagger
        className="grid border-y border-ink md:grid-cols-2 lg:grid-cols-3"
      >
        {steps.map((step) => (
          <RevealItem key={step.number}>
            <article className="min-h-80 border-b border-ink p-5 md:border-r lg:border-b-0">
              <p className="eyebrow text-maroon">{step.number}</p>
              <h3 className="mt-6 font-heading text-4xl font-medium leading-tight">
                {step.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-ink/72">
                {step.body}
              </p>
              <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2">
                {step.skills.map((skill) => (
                  <span key={skill} className="text-sm font-medium text-ink/60">
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
