"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { quickSpring } from "@/lib/motion";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const sizeClasses: Record<Project["size"], string> = {
  feature: "lg:col-span-6 lg:row-span-2 min-h-[560px]",
  large: "lg:col-span-6 min-h-[480px]",
  medium: "lg:col-span-4 min-h-[440px]",
  small: "lg:col-span-3 min-h-[390px]"
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col overflow-hidden border-2 border-ink bg-paper p-5 shadow-editorial-soft",
        sizeClasses[project.size]
      )}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -6,
              rotate: index % 2 === 0 ? -0.45 : 0.45
            }
      }
      whileTap={reduceMotion ? undefined : { y: 2, scale: 0.992 }}
      transition={quickSpring}
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-maroon">{project.category}</p>
          <h3 className="heading-lg mt-3 max-w-[620px]">{project.name}</h3>
          {project.alsoKnownAs ? (
            <p className="mt-2 text-sm font-medium text-ink/60">{project.alsoKnownAs}</p>
          ) : null}
        </div>
        <span className="hidden text-sm font-medium text-ink/40 md:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <motion.div
        className="relative mb-7 h-28 overflow-hidden border border-ink bg-ink"
        animate={reduceMotion ? undefined : { backgroundPositionX: ["0%", "100%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(90deg, #030303 0 24%, #ffffff 24% 26%, #6e1f24 26% 39%, #030303 39% 70%, #ffffff 70% 72%, #6e1f24 72% 100%)",
          backgroundSize: "240% 100%"
        }}
      >
        <motion.div
          className="absolute bottom-5 left-5 h-10 w-24 bg-paper"
          whileHover={reduceMotion ? undefined : { x: 12 }}
        />
        <motion.div
          className="absolute right-6 top-5 h-14 w-14 border-2 border-paper"
          whileHover={reduceMotion ? undefined : { rotate: 8 }}
        />
      </motion.div>

      <div className="grid gap-4 text-sm leading-6 md:grid-cols-2">
        <ProjectFact label="Problem" value={project.problem} />
        <ProjectFact label="Role" value={project.role} />
        <ProjectFact label="Decision" value={project.decision} />
        <ProjectFact label="Outcome" value={project.outcome} />
      </div>

      <div className="mt-auto pt-7">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-ink/55">
          Technology
        </p>
        <p className="text-sm leading-6 text-ink/75">{project.technologies.join(" · ")}</p>
        {project.links?.length ? (
          <div className="mt-5 flex flex-wrap gap-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-maroon underline decoration-maroon underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-maroon transition-all duration-300 group-hover:w-full" />
    </motion.article>
  );
}

function ProjectFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-maroon">{label}</p>
      <p className="text-ink/78">{value}</p>
    </div>
  );
}
