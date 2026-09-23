"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { EmbeddedDiagram } from "@/components/projects/embedded-diagram";
import type { TranslationKey } from "@/types/content";

const EmbeddedHardwareCanvas = dynamic(
  () =>
    import("@/components/three/embedded-hardware-canvas").then(
      (mod) => mod.EmbeddedHardwareCanvas
    ),
  { ssr: false, loading: () => <EmbeddedDiagram /> }
);

type EmbeddedSectionProps = {
  t: (key: TranslationKey) => string;
};

export function EmbeddedSection({ t }: EmbeddedSectionProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section ref={ref} className="border-y border-ink py-24 md:py-32">
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
        <motion.div
          className="relative h-[340px] border border-ink bg-paper md:h-[440px]"
          aria-hidden="true"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
          animate={
            inView && !reduceMotion ? { opacity: 1, scale: 1 } : undefined
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {inView ? <EmbeddedHardwareCanvas /> : <EmbeddedDiagram />}
        </motion.div>
      </div>
    </section>
  );
}
