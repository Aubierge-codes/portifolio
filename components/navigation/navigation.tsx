"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { Logo } from "@/components/navigation/logo";
import { SpringButton } from "@/components/motion/spring-button";
import { cn } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";

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
    const handleScroll = () => setCompact(window.scrollY > 28);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b border-ink/10 bg-paper transition-[padding]",
        compact ? "py-2" : "py-4"
      )}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <nav className="section-shell" aria-label="Primary">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#top"
            className="flex min-h-11 items-center gap-2 font-heading text-2xl font-medium leading-none"
          >
            <Logo size={compact ? 34 : 40} />
            <span>{t("brand")}</span>
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                className="text-sm text-ink/75 underline-offset-4 transition-colors hover:text-maroon hover:underline"
                href={link.href}
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher
              locale={locale}
              setLocale={setLocale}
              label={t("language.label")}
            />
            <SpringButton
              href="#work"
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              {t("nav.viewWork")}
            </SpringButton>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-5 overflow-x-auto pb-1 lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              className="shrink-0 min-h-11 inline-flex items-center text-sm text-ink/75 underline-offset-4 hover:text-maroon hover:underline"
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
