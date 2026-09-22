"use client";

import { localizedProjects } from "@/data/projects";
import { AnimatedText } from "@/components/motion/animated-text";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { Locale, TranslationKey } from "@/types/content";

type ProjectStoriesProps = {
  t: (key: TranslationKey) => string;
  locale: Locale;
};

const featuredIds = ["heringress", "umucocore", "zero-bite"];

export function ProjectStories({ t, locale }: ProjectStoriesProps) {
  const projects = localizedProjects[locale];
  const featured = featuredIds
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);

  return (
    <section className="border-y border-ink bg-ink py-24 text-paper md:py-32">
      <div className="section-shell">
        <Reveal
          stagger
          className="mb-14 grid gap-6 lg:grid-cols-[0.8fr_0.42fr] lg:items-end"
        >
          <RevealItem>
            <p className="eyebrow mb-4 text-paper/70">{t("stories.eyebrow")}</p>
            <AnimatedText
              value={t("stories.title")}
              as="h2"
              className="heading-lg text-paper"
            />
          </RevealItem>
          <RevealItem>
            <AnimatedText
              value={t("stories.copy")}
              as="p"
              className="body-large text-paper/70"
            />
          </RevealItem>
        </Reveal>
        <div className="grid gap-5">
          {featured.map((project, index) =>
            project ? (
              <Reveal
                stagger
                key={project.id}
                className="grid gap-5 border border-paper/25 p-5 lg:grid-cols-[0.36fr_1fr]"
              >
                <RevealItem>
                  <div className="sticky top-28">
                    <p className="eyebrow text-paper/55">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="heading-lg mt-3 text-paper">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-paper/60">{project.category}</p>
                  </div>
                </RevealItem>
                <div className="grid gap-4 md:grid-cols-2">
                  <StoryBeat
                    label={t("project.problem")}
                    value={project.problem}
                  />
                  <StoryBeat label={t("project.role")} value={project.role} />
                  <StoryBeat
                    label={t("project.decision")}
                    value={project.decision}
                  />
                  <StoryBeat
                    label={t("project.result")}
                    value={project.outcome}
                  />
                </div>
              </Reveal>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

function StoryBeat({ label, value }: { label: string; value: string }) {
  return (
    <RevealItem>
      <div className="min-h-52 border-l-2 border-maroon bg-paper p-5 text-ink">
        <p className="eyebrow mb-4 text-maroon">{label}</p>
        <p className="text-base leading-7">{value}</p>
      </div>
    </RevealItem>
  );
}
