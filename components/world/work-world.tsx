"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll
} from "framer-motion";
import { localizedProjects } from "@/data/projects";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { hasWebGL } from "@/lib/webgl";
import { useSiteEntered } from "@/lib/site-ready";
import { cn } from "@/lib/utils";
import { DetailsPanel } from "@/components/world/details-panel";
import { ProjectMeta } from "@/components/world/project-meta";
import type { Locale, Project, TranslationKey } from "@/types/content";

const WorldCanvas = dynamic(
  () => import("@/components/world/world-canvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null }
);

type WorkWorldProps = {
  t: (key: TranslationKey) => string;
  locale: Locale;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The Work section: ten projects as ten sets in one 3D world, travelled by
 * scrolling. Visitors who prefer reduced motion, or whose browser has no
 * WebGL, get a still gallery of the same chapters instead.
 *
 * Both branches render the same markup on the server; the choice is made
 * after mount, once the preference and WebGL support are known.
 */
export function WorkWorld({ t, locale }: WorkWorldProps) {
  const projects = localizedProjects[locale];
  const reduceMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(true);
  const [details, setDetails] = useState<Project | null>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  return (
    <>
      {reduceMotion || !webgl ? (
        <WorkGallery projects={projects} t={t} onDetails={setDetails} />
      ) : (
        <WorkStage projects={projects} t={t} onDetails={setDetails} />
      )}
      <DetailsPanel project={details} onClose={() => setDetails(null)} t={t} />
    </>
  );
}

type BranchProps = {
  projects: Project[];
  t: (key: TranslationKey) => string;
  onDetails: (project: Project) => void;
};

function WorkStage({ projects, t, onDetails }: BranchProps) {
  const isMobile = useIsMobile();
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [near, setNear] = useState(false);
  // Held back until the loader lifts, so compiling the world can't stall it.
  const entered = useSiteEntered();
  const count = projects.length;

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"]
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progress.current = value;
    const index = Math.round(value * (count - 1));
    setActive((current) => (current === index ? current : index));
    setStarted(value > 0.01);
  });

  // The world only holds a WebGL context while the section is close.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "100% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const jump = (index: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + (index / (count - 1)) * travel,
      behavior: "smooth"
    });
  };

  const project = projects[active];

  return (
    <section
      id="work"
      ref={section}
      className="relative"
      style={{ height: `${count * (isMobile ? 85 : 100)}svh` }}
      aria-labelledby="work-title"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#f4f1ec]">
        <div className="absolute inset-0" aria-hidden="true">
          {near && entered ? (
            <WorldCanvas progress={progress} isMobile={isMobile} />
          ) : null}
        </div>

        {/* Legibility wash behind the text; the scene stays clear elsewhere. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-paper via-paper/70 to-transparent md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-[46%] md:bg-gradient-to-r"
          aria-hidden="true"
        />

        <div className="section-shell relative flex h-full flex-col justify-between pb-10 pt-24 md:pb-14 md:pt-28">
          <div>
            <p className="eyebrow text-maroon">{t("work.eyebrow")}</p>
            <h2 id="work-title" className="sr-only">
              {t("work.title")}
            </h2>
            <p className="mt-3 font-heading text-[15px] tabular-nums tracking-[0.08em] text-ink/70">
              <span className="text-ink">{pad(active + 1)}</span>
              <span className="mx-2 text-ink/30">/</span>
              {pad(count)}
            </p>
          </div>

          <div className="max-w-[440px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="heading-lg">{project.name}</h3>
                <p className="mt-3 text-[17px] leading-7 text-ink/75">
                  {project.summary}
                </p>
                <ProjectMeta
                  project={project}
                  t={t}
                  onDetails={() => onDetails(project)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Chapter rail: where you are, and a way to jump. */}
        <nav
          aria-label={t("work.eyebrow")}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 md:bottom-auto md:left-auto md:right-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:gap-2 lg:right-10"
        >
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => jump(i)}
              aria-label={`${t("work.goTo")} ${p.name}`}
              aria-current={i === active ? "step" : undefined}
              className="group flex min-h-6 min-w-6 items-center justify-center md:min-h-7 md:justify-end md:gap-3"
            >
              <span className="hidden text-xs text-ink/0 transition-colors group-hover:text-ink/60 md:inline">
                {p.name}
              </span>
              <span
                className={cn(
                  "block transition-all duration-300",
                  i === active
                    ? "h-1.5 w-5 bg-maroon md:h-px md:w-8"
                    : "h-1.5 w-1.5 bg-ink/25 md:h-px md:w-4"
                )}
              />
            </button>
          ))}
        </nav>

        <AnimatePresence>
          {started ? null : (
            <motion.p
              className="pointer-events-none absolute bottom-16 left-1/2 hidden -translate-x-1/2 md:block text-[11px] uppercase tracking-[0.2em] text-ink/45 md:bottom-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {t("work.hint")} ↓
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function WorkGallery({ projects, t, onDetails }: BranchProps) {
  return (
    <section id="work" className="py-24 md:py-32" aria-labelledby="work-title">
      <div className="section-shell">
        <p className="eyebrow text-maroon">{t("work.eyebrow")}</p>
        <h2 id="work-title" className="heading-lg mt-4 max-w-[720px]">
          {t("work.title")}
        </h2>
        <p className="body-large mt-4 text-ink/70">{t("work.copy")}</p>
        <ol className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {projects.map((project, i) => (
            <li key={project.id}>
              {/* Stills rendered from the live 3D chapters. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/posters/${project.id}.jpg`}
                alt=""
                width={1200}
                height={750}
                loading="lazy"
                className="aspect-[16/10] w-full border border-ink/15 bg-[#f4f1ec] object-cover"
              />
              <p className="mt-5 font-heading text-sm tabular-nums text-ink/45">
                {pad(i + 1)}
              </p>
              <h3 className="heading-md mt-1">{project.name}</h3>
              <p className="mt-2 text-ink/75">{project.summary}</p>
              <ProjectMeta
                project={project}
                t={t}
                onDetails={() => onDetails(project)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
