"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useInView } from "framer-motion";
import { localizedProjects } from "@/data/projects";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/work/project-card";
import { FloatingBalloon } from "@/components/motion/floating-balloon";
import { BouncingBall } from "@/components/motion/bouncing-ball";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";

const WorkLaptopCanvas = dynamic(
  () =>
    import("@/components/three/work-laptop-canvas").then(
      (mod) => mod.WorkLaptopCanvas
    ),
  { ssr: false, loading: () => <div /> }
);

type WorkSectionProps = {
  t: (key: TranslationKey) => string;
  locale: Locale;
};

export function WorkSection({ t, locale }: WorkSectionProps) {
  const projects = localizedProjects[locale];
  const isMobile = useIsMobile();
  const laptopRef = useRef<HTMLDivElement>(null);
  const laptopInView = useInView(laptopRef, { amount: 0.4, once: true });
  const papers = [
    t("papers.learn"),
    t("papers.build"),
    t("papers.apply"),
    t("papers.grow")
  ];

  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="section-shell">
        <Reveal
          stagger
          className="mb-12 grid gap-6 lg:grid-cols-[0.74fr_0.46fr] lg:items-end"
        >
          <RevealItem>
            <div className="mb-4 flex items-center gap-3">
              <p className="eyebrow text-maroon">{t("work.eyebrow")}</p>
              <BouncingBall size={16} />
            </div>
            <AnimatedText
              value={t("work.title")}
              as="h2"
              className="heading-lg max-w-[820px]"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("work.copy")}
              as="p"
              className="body-large text-ink/70"
            />
            <div
              ref={laptopRef}
              className={cn(
                "relative mt-6 h-52 border border-ink/15 bg-paper transition-opacity duration-700 md:h-64",
                laptopInView ? "opacity-100" : "opacity-0"
              )}
              aria-hidden="true"
            >
              {laptopInView ? <WorkLaptopCanvas /> : null}
            </div>
          </RevealItem>
        </Reveal>
        <Reveal stagger className="grid gap-5 lg:grid-cols-12">
          {projects.map((project, index) => (
            <RevealItem key={project.id} className="contents">
              <ProjectCard
                project={project}
                index={index}
                t={t}
                papers={papers}
              />
            </RevealItem>
          ))}
        </Reveal>
        <div className="mt-14 flex items-end justify-end gap-6">
          <FloatingBalloon tone="maroon" label={t("balloon.next")} />
          {isMobile ? null : (
            <FloatingBalloon tone="paper" label="→" delay={0.4} />
          )}
        </div>
      </div>
    </section>
  );
}
