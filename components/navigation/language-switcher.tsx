"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { languages } from "@/data/translations";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

type LanguageSwitcherProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  label: string;
  variant?: "mark" | "rail";
};

export function LanguageSwitcher({
  locale,
  setLocale,
  label,
  variant = "mark"
}: LanguageSwitcherProps) {
  if (variant === "rail") {
    return (
      <LanguageList
        locale={locale}
        label={label}
        onSelect={setLocale}
        className="relative"
      />
    );
  }

  return <LanguageMark locale={locale} setLocale={setLocale} label={label} />;
}

function LanguageMark({
  locale,
  setLocale,
  label
}: Omit<LanguageSwitcherProps, "variant">) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current =
    languages.find((language) => language.code === locale) ?? languages[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="flex min-h-11 min-w-11 items-center gap-2 px-1.5"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex h-7 w-px bg-maroon" aria-hidden="true" />
        <span className="flex flex-col items-start justify-center">
          <span className="font-heading text-[13px] font-medium leading-none tracking-[0.22em]">
            {current.short}
          </span>
          <span className="mt-1 block h-px w-7 bg-ink" aria-hidden="true" />
        </span>
      </button>
      {open ? (
        <LanguageList
          id={listId}
          locale={locale}
          label={label}
          autoFocus
          onSelect={setLocale}
          onActivate={() => setOpen(false)}
          className="absolute right-0 top-[calc(100%+6px)] z-[60] min-w-[12.75rem] border border-ink bg-paper"
        />
      ) : null}
    </div>
  );
}

function LanguageList({
  id,
  locale,
  label,
  onSelect,
  onActivate,
  autoFocus = false,
  className
}: {
  id?: string;
  locale: Locale;
  label: string;
  onSelect: (locale: Locale) => void;
  onActivate?: () => void;
  autoFocus?: boolean;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIndex = Math.max(
    0,
    languages.findIndex((language) => language.code === locale)
  );

  useEffect(() => {
    if (autoFocus) listRef.current?.focus();
  }, [autoFocus]);

  const move = (direction: 1 | -1) => {
    const next =
      languages[(selectedIndex + direction + languages.length) % languages.length];
    onSelect(next.code);
  };

  return (
    <div
      ref={listRef}
      id={id}
      role="listbox"
      tabIndex={0}
      aria-label={label}
      aria-orientation="vertical"
      className={cn("relative outline-none", className)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate?.();
        }
      }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 w-0.5 bg-maroon"
        animate={{ top: 8 + selectedIndex * 52, height: 36 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
      />
      {languages.map((language) => {
        const selected = language.code === locale;
        return (
          <button
            key={language.code}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={selected}
            aria-label={language.label}
            className={cn(
              "flex h-[52px] min-h-11 w-full flex-col items-start justify-center px-4 text-left",
              selected ? "text-ink" : "text-ink/55 hover:text-maroon"
            )}
            onClick={() => {
              onSelect(language.code);
              onActivate?.();
            }}
          >
            <span className="font-heading text-[11px] font-medium leading-none tracking-[0.22em]">
              {language.short}
            </span>
            <span className="mt-1 whitespace-nowrap text-sm leading-5">
              {language.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
