"use client";

import type { Project, TranslationKey } from "@/types/content";

/** Tags, repository links and the Details button, shared by stage and fallback. */
export function ProjectMeta({
  project,
  t,
  onDetails
}: {
  project: Project;
  t: (key: TranslationKey) => string;
  onDetails: () => void;
}) {
  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="border border-ink/20 bg-paper/80 px-2.5 py-1 text-xs tracking-[0.04em] text-ink/75"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
        <button
          type="button"
          onClick={onDetails}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          {t("project.details")}
          <span aria-hidden="true">+</span>
        </button>
        {project.links?.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-sm text-maroon underline decoration-maroon/40 underline-offset-4 hover:decoration-maroon"
          >
            {link.label}
            <span className="sr-only"> ({project.name})</span>
          </a>
        ))}
      </div>
    </>
  );
}
