"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project, TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type DetailsPanelProps = {
  project: Project | null;
  onClose: () => void;
  t: (key: TranslationKey) => string;
};

/**
 * The longer story behind a project (problem, role, decision, outcome and the
 * people involved), kept out of the way until someone asks for it.
 */
export function DetailsPanel({ project, onClose, t }: DetailsPanelProps) {
  const reduceMotion = useReducedMotion();
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const opener = document.activeElement as HTMLElement | null;
    close.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/30 p-4 backdrop-blur-[2px] sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-title"
            className="max-h-[85svh] w-full max-w-[560px] overflow-y-auto border border-ink bg-paper p-6 sm:p-8"
            initial={reduceMotion ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 id="details-title" className="heading-md">
                  {project.name}
                </h3>
                {project.alsoKnownAs ? (
                  <p className="mt-1 text-sm text-ink/55">
                    {t("project.alsoKnown")} · {project.alsoKnownAs}
                  </p>
                ) : null}
              </div>
              <button
                ref={close}
                type="button"
                onClick={onClose}
                className="min-h-11 shrink-0 border border-ink px-4 text-sm hover:bg-ink hover:text-paper"
              >
                {t("project.close")}
              </button>
            </div>
            <dl className="mt-6 grid gap-4 text-[15px] leading-6">
              {(
                [
                  ["project.problem", project.problem],
                  ["project.role", project.role],
                  ["project.decision", project.decision],
                  ["project.outcome", project.outcome]
                ] as [TranslationKey, string][]
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-[0.12em] text-maroon">
                    {t(label)}
                  </dt>
                  <dd className="mt-1 text-ink/80">{value}</dd>
                </div>
              ))}
            </dl>
            {project.context ||
            project.team ||
            project.mentor ||
            project.coach ? (
              <div className="mt-6 grid gap-1 border-t border-ink/15 pt-4 text-sm text-ink/65">
                {project.context ? (
                  <p>
                    {t("project.context")} · {project.context}
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
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
