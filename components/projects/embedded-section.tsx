"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { TranslationKey } from "@/types/content";

const nodes = [
  { label: "Pi", x: "12%", y: "28%" },
  { label: "ESP", x: "38%", y: "18%" },
  { label: "Arduino", x: "64%", y: "30%" },
  { label: "Sensor", x: "22%", y: "62%" },
  { label: "ML", x: "72%", y: "64%" }
];

type EmbeddedSectionProps = {
  t: (key: TranslationKey) => string;
};

export function EmbeddedSection({ t }: EmbeddedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-ink py-24 md:py-32">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_0.5fr] lg:items-center">
        <Reveal stagger>
          <RevealItem>
            <p className="eyebrow mb-4 text-maroon">{t("embedded.eyebrow")}</p>
            <AnimatedText
              value={t("embedded.title")}
              as="h2"
              className="heading-lg"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("embedded.copy")}
              as="p"
              className="body-large mt-6 text-ink/72"
            />
          </RevealItem>
        </Reveal>
        <div className="relative min-h-[280px] border border-ink bg-paper" aria-hidden="true">
          {nodes.map((node, index) => (
            <motion.button
              key={node.label}
              type="button"
              tabIndex={-1}
              className="absolute min-h-11 border border-ink bg-paper px-3 text-xs uppercase tracking-[0.12em]"
              style={{ left: node.x, top: node.y }}
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, index % 2 ? -6 : 5, 0] }
              }
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              transition={{ duration: 2.6 + index * 0.2, repeat: Infinity }}
            >
              {node.label}
            </motion.button>
          ))}
          <motion.span
            className="absolute left-[18%] top-[40%] h-px w-[54%] bg-maroon origin-left"
            animate={reduceMotion ? undefined : { scaleX: [0.3, 1, 0.3] }}
            transition={{ duration: 3.4, repeat: Infinity }}
          />
        </div>
      </div>
    </section>
  );
}
