"use client";

import { localizedProjects } from "@/data/projects";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/work/project-card";
import type { Locale, TranslationKey } from "@/types/content";

type WorkSectionProps = {
  t: (key: TranslationKey) => string;
  locale: Locale;
};

export function WorkSection({ t, locale }: WorkSectionProps) {
  const projects = localizedProjects[locale];

  return (
    <section id="work" className="section-shell py-24 md:py-32">
      <Reveal stagger className="mb-12 grid gap-6 lg:grid-cols-[0.74fr_0.46fr] lg:items-end">
        <RevealItem>
          <p className="eyebrow mb-4 text-maroon">{t("work.eyebrow")}</p>
          <AnimatedText value={t("work.title")} as="h2" className="heading-lg max-w-[820px]" />
        </RevealItem>
        <RevealItem>
          <AnimatedText value={t("work.copy")} as="p" className="body-large text-ink/70" />
        </RevealItem>
      </Reveal>
      <Reveal stagger className="grid auto-rows-fr gap-5 lg:grid-cols-12">
        {projects.map((project, index) => (
          <RevealItem key={project.id}>
            <ProjectCard project={project} index={index} t={t} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}
