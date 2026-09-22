"use client";

import { languages } from "@/data/translations";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/content";

type LanguageSwitcherProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  label: string;
};

export function LanguageSwitcher({
  locale,
  setLocale,
  label
}: LanguageSwitcherProps) {
  return (
    <div
      className="flex min-h-11 items-center border border-ink bg-paper"
      role="group"
      aria-label={label}
    >
      {languages.map((language) => (
        <button
          key={language.code}
          type="button"
          className={cn(
            "min-h-11 min-w-11 px-2.5 text-xs transition-colors",
            locale === language.code
              ? "bg-maroon text-paper"
              : "bg-paper text-ink hover:text-maroon"
          )}
          aria-pressed={locale === language.code}
          aria-label={language.label}
          onClick={() => setLocale(language.code)}
        >
          {language.short}
        </button>
      ))}
    </div>
  );
}
