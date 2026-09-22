"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { languages } from "@/data/translations";
import { cn } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";
import { MotionButton } from "@/components/motion/motion-button";

type NavigationProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const links: { href: string; key: TranslationKey }[] = [
  { href: "#work", key: "nav.work" },
  { href: "#process", key: "nav.process" },
  { href: "#about", key: "nav.about" },
  { href: "#contact", key: "nav.contact" }
];

export function Navigation({ locale, setLocale, t }: NavigationProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 36);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-md transition-all",
        compact ? "py-2" : "py-4"
      )}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <nav className="section-shell" aria-label="Primary">
        <div className="flex items-center justify-between gap-4">
        <a className="font-heading text-2xl font-medium leading-none" href="#top">
          {t("brand")}
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-sm font-medium text-ink/75 underline-offset-4 transition hover:text-maroon hover:underline"
              href={link.href}
            >
              {t(link.key)}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <MotionButton href="#work" variant="secondary" className="hidden sm:inline-flex">
            {t("nav.viewWork")}
          </MotionButton>
          <div
            className="flex min-h-11 items-center border border-ink bg-paper"
            role="group"
            aria-label={t("language.label")}
          >
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                className={cn(
                  "min-h-11 px-2.5 text-xs font-medium transition",
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
        </div>
        </div>
        <div className="mt-3 flex items-center gap-4 overflow-x-auto pb-1 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              className="shrink-0 text-sm font-medium text-ink/75 underline-offset-4 transition hover:text-maroon hover:underline"
              href={link.href}
            >
              {t(link.key)}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
