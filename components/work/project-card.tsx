"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { usePointerTilt } from "@/hooks/use-pointer-tilt";
import { cn } from "@/lib/utils";
import { quickSpring } from "@/lib/motion";
import { HerIngressScene } from "@/components/projects/scenes/heringress-scene";
import { UmucoScene } from "@/components/projects/scenes/umuco-scene";
import { GwizaScene } from "@/components/projects/scenes/gwiza-scene";
import { EcoScene } from "@/components/projects/scenes/eco-scene";
import { ZeroBiteScene } from "@/components/projects/scenes/zero-bite-scene";
import { KinetiqScene } from "@/components/projects/scenes/kinetiq-scene";
import {
  BookstoreScene,
  JavaScene,
  VeloraScene,
  WeatherScene
} from "@/components/projects/scenes/small-scenes";
import type { Project, TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ZeroBiteCanvas = dynamic(
  () =>
    import("@/components/three/zero-bite-canvas").then(
      (mod) => mod.ZeroBiteCanvas
    ),
  { ssr: false, loading: () => <ZeroBiteScene /> }
);

const KinetiqCanvas = dynamic(
  () =>
    import("@/components/three/kinetiq-canvas").then(
      (mod) => mod.KinetiqCanvas
    ),
  { ssr: false, loading: () => <KinetiqScene /> }
);

type ProjectCardProps = {
  project: Project;
  index: number;
  t: (key: TranslationKey) => string;
  papers: string[];
};

const sizeClasses: Record<Project["size"], string> = {
  feature: "lg:col-span-6",
  large: "lg:col-span-6",
  medium: "lg:col-span-6",
  small: "lg:col-span-4"
};

export function ProjectCard({ project, index, t, papers }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const tilt = usePointerTilt(!reduceMotion && !isMobile);

  return (
    <motion.article
      id={project.id}
      className={cn(
        // min-w-0: grid items default to min-width:auto, which refused to
        // shrink below the card's intrinsic content width and pushed every
        // card past the viewport at 320px.
        "group relative flex min-w-0 flex-col border border-ink bg-paper p-5",
        sizeClasses[project.size]
      )}
      style={tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      whileHover={reduceMotion || isMobile ? undefined : { y: -5 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985, y: 3 }}
      transition={quickSpring}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-maroon">{project.category}</p>
          <h3 className="heading-md mt-3">{project.name}</h3>
          {project.alsoKnownAs ? (
            <p className="mt-2 text-sm text-ink/60">
              {t("project.alsoKnown")} · {project.alsoKnownAs}
            </p>
          ) : null}
        </div>
        <span className="hidden text-sm text-ink/35 md:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <ProjectScene id={project.id} papers={papers} />

      <div className="mt-5 grid gap-4 text-sm leading-6 md:grid-cols-2">
        <Fact label={t("project.problem")} value={project.problem} />
        <Fact label={t("project.role")} value={project.role} />
        <Fact label={t("project.decision")} value={project.decision} />
        <Fact label={t("project.outcome")} value={project.outcome} />
      </div>

      {project.status || project.context || project.team ? (
        <div className="mt-5 grid gap-2 text-sm text-ink/70">
          {project.context ? (
            <p>
              {t("project.context")} · {project.context}
            </p>
          ) : null}
          {project.status ? (
            <p>
              {t("project.status")} · {project.status}
            </p>
          ) : null}
          {project.team ? (
            <p>
              {t("project.team")} · {project.team.join(" · ")}
            </p>
          ) : null}
          {project.mentor ? (
            <p>
              {t("project.mentor")} · {project.mentor}
            </p>
          ) : null}
          {project.coach ? (
            <p>
              {t("project.coach")} · {project.coach}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto pt-6">
        <p className="mb-2 text-xs uppercase tracking-[0.12em] text-ink/50">
          {t("project.technology")}
        </p>
        <p className="text-sm leading-6 text-ink/75">
          {project.technologies.join(" · ")}
        </p>
        {project.links?.length ? (
          <div className="mt-4 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="min-h-11 inline-flex items-center text-sm text-maroon underline decoration-maroon underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-maroon transition-all duration-300 group-hover:w-full" />
    </motion.article>
  );
}

function ProjectScene({ id, papers }: { id: string; papers: string[] }) {
  if (id === "heringress") return <HerIngressScene papers={papers} />;
  if (id === "umucocore") return <UmucoScene />;
  if (id === "gwiza") return <GwizaScene />;
  if (id === "eco-girls") return <EcoScene />;
  if (id === "zero-bite") return <ZeroBiteCanvas />;
  if (id === "kinetiq") return <KinetiqCanvas />;
  if (id === "velora") return <VeloraScene />;
  if (id === "weather") return <WeatherScene />;
  if (id === "bookstore") return <BookstoreScene />;
  return <JavaScene />;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.12em] text-maroon">
        {label}
      </p>
      <p className="text-ink/78">{value}</p>
    </div>
  );
}
