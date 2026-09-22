"use client";

import { Reveal, RevealItem } from "@/components/motion/reveal";

type CredibilityStripProps = {
  title: string;
  items: string[];
};

export function CredibilityStrip({ title, items }: CredibilityStripProps) {
  return (
    <section className="section-shell border-y border-ink py-6" aria-label={title}>
      <Reveal stagger className="grid gap-4 md:grid-cols-[0.24fr_1fr] md:items-center">
        <RevealItem>
          <p className="eyebrow text-maroon">{title}</p>
        </RevealItem>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <RevealItem key={item}>
              <p className="min-h-14 border-l-2 border-maroon pl-3 text-sm font-medium leading-5 text-ink">
                {item}
              </p>
            </RevealItem>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
