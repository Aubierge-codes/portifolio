"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { FaqItem, TranslationKey } from "@/types/content";

type FaqSectionProps = {
  t: (key: TranslationKey) => string;
  items: FaqItem[];
};

export function FaqSection({ t, items }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));
  const reduceMotion = useReducedMotion();

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="section-shell py-24 md:py-32">
      <Reveal stagger className="grid gap-10 lg:grid-cols-[0.46fr_0.74fr]">
        <div>
          <RevealItem>
            <p className="eyebrow mb-4 text-maroon">{t("faq.eyebrow")}</p>
            <AnimatedText value={t("faq.title")} as="h2" className="heading-lg" />
          </RevealItem>
        </div>
        <RevealItem>
          <div className="border-y border-ink">
            {items.map((item, index) => {
              const open = openItems.has(index);
              return (
                <div key={item.question} className="border-b border-ink last:border-b-0">
                  <button
                    type="button"
                    className="flex min-h-20 w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => toggleItem(index)}
                  >
                    <span className="font-heading text-2xl font-medium leading-tight">
                      {item.question}
                    </span>
                    <motion.span
                      className="grid h-9 w-9 shrink-0 place-items-center border border-ink"
                      animate={reduceMotion ? undefined : { rotate: open ? 45 : 0 }}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[760px] pb-6 text-base leading-7 text-ink/72">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
