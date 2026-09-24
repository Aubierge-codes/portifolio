"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { Logo } from "@/components/navigation/logo";
import { SpringButton } from "@/components/motion/spring-button";
import { cn } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type NavigationProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const links: { href: string; key: TranslationKey; index: string }[] = [
  { href: "#work", key: "nav.work", index: "01" },
  { href: "#process", key: "nav.process", index: "02" },
  { href: "#about", key: "nav.about", index: "03" },
  { href: "#contact", key: "nav.contact", index: "04" }
];

export function Navigation({ locale, setLocale, t }: NavigationProps) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const reduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 28);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const update = () => setHeaderHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusables = () => getFocusable(panel);
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <motion.header
        ref={headerRef}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 border-b border-ink/10 bg-paper transition-[padding]",
          compact ? "py-2" : "py-4"
        )}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
      >
        <nav className="section-shell" aria-label="Primary">
          <div className="flex items-center justify-between gap-3">
            <a
              href="#top"
              className="flex min-h-11 min-w-0 items-center gap-2 font-heading text-2xl font-medium leading-none"
              onClick={closeMenu}
            >
              <Logo size={compact ? 34 : 40} />
              <span className="truncate">{t("brand")}</span>
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
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <LanguageSwitcher
                locale={locale}
                setLocale={setLocale}
                label={t("language.label")}
              />
              <SpringButton
                href="#work"
                variant="secondary"
                className="hidden lg:inline-flex"
              >
                {t("nav.viewWork")}
              </SpringButton>
              <button
                ref={toggleRef}
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center lg:hidden"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? t("nav.closeMenu") : t("nav.menu")}
                onClick={() => setOpen((value) => !value)}
              >
                <HamburgerIcon open={open} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <div className="lg:hidden" key="mobile-nav">
            <motion.button
              type="button"
              tabIndex={-1}
              className="fixed inset-x-0 bottom-0 z-40 bg-ink/25"
              style={{ top: headerHeight }}
              aria-label={t("nav.closeMenu")}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={closeMenu}
            />
            <motion.div
              ref={panelRef}
              id={menuId}
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.menu")}
              className="fixed bottom-0 right-0 z-[45] flex w-[min(100%,22rem)] max-w-full flex-col overflow-y-auto overflow-x-hidden border-l border-ink bg-paper overscroll-contain"
              style={{ top: headerHeight }}
              initial={reduceMotion ? { opacity: 1 } : { x: 28, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            >
              <ul className="flex flex-col px-6 py-8">
                {links.map((link) => (
                  <li key={link.href} className="border-b border-ink/10">
                    <a
                      href={link.href}
                      className="flex min-h-11 items-baseline justify-between gap-6 py-4"
                      onClick={closeMenu}
                    >
                      <span className="font-heading text-3xl font-medium tracking-[-0.03em]">
                        {t(link.key)}
                      </span>
                      <span className="text-xs tracking-[0.18em] text-maroon">
                        {link.index}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-ink px-6 py-6">
                <a
                  href="#work"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 w-full items-center justify-center border border-ink bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:border-maroon hover:bg-maroon"
                >
                  {t("nav.viewWork")}
                </a>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") && element.getClientRects().length > 0
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-5" aria-hidden="true">
      <span
        className={cn(
          "absolute left-0 h-px w-5 bg-ink transition-transform duration-200",
          open ? "top-[5px] rotate-45" : "top-0"
        )}
      />
      <span
        className={cn(
          "absolute left-0 h-px w-5 bg-ink transition-transform duration-200",
          open ? "top-[5px] -rotate-45" : "top-[10px]"
        )}
      />
    </span>
  );
}
