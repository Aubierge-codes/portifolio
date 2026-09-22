"use client";

import { motion, useReducedMotion } from "framer-motion";
import { githubUrl } from "@/data/projects";
import { Logo } from "@/components/navigation/logo";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { LineCharacter } from "@/components/characters/line-character";
import { emailAddress } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";

type SiteFooterProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

export function SiteFooter({ locale, setLocale, t }: SiteFooterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-ink bg-paper py-12">
      <div className="section-shell">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <p className="font-heading text-3xl font-medium">
                Aubierge Umurerwa
              </p>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/65">
              {t("footer.role")}
            </p>
          </div>
          <FooterColumn
            title={t("footer.explore")}
            links={[
              { label: t("nav.work"), href: "#work" },
              { label: t("nav.process"), href: "#process" },
              { label: t("nav.about"), href: "#about" },
              { label: t("nav.contact"), href: "#contact" }
            ]}
          />
          <FooterColumn
            title={t("footer.connect")}
            links={[
              { label: "GitHub", href: githubUrl },
              { label: "Email", href: `mailto:${emailAddress}` }
            ]}
          />
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.12em] text-maroon">
              {t("footer.languages")}
            </p>
            <LanguageSwitcher
              locale={locale}
              setLocale={setLocale}
              label={t("language.label")}
              variant="rail"
            />
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink pt-5 text-sm text-ink/65">
          <p>© Aubierge Umurerwa</p>
          <p>{t("footer.built")}</p>
        </div>
      </div>
      <motion.div
        className="pointer-events-none absolute bottom-2 right-0 w-20"
        aria-hidden="true"
        animate={reduceMotion ? { x: 0 } : { x: [40, 160] }}
        transition={{ duration: 4.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeIn" }}
      >
        <LineCharacter pose={reduceMotion ? "idle" : "run"} duration={0.36} />
      </motion.div>
    </footer>
  );
}

function FooterColumn({
  title,
  links
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="mb-4 text-sm uppercase tracking-[0.12em] text-maroon">
        {title}
      </p>
      <div className="grid gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="min-h-11 inline-flex items-center text-sm underline-offset-4 hover:text-maroon hover:underline"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
