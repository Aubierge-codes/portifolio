"use client";

import { githubUrl } from "@/data/projects";
import { AnimatedText } from "@/components/motion/animated-text";
import { MotionButton } from "@/components/motion/motion-button";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import type { TranslationKey } from "@/types/content";

type ContactSectionProps = {
  t: (key: TranslationKey) => string;
};

export function ContactSection({ t }: ContactSectionProps) {
  return (
    <section id="contact" className="bg-maroon py-24 text-paper md:py-32">
      <div className="section-shell">
        <Reveal stagger className="grid gap-10 lg:grid-cols-[0.72fr_0.42fr] lg:items-start">
          <div>
            <RevealItem>
              <p className="eyebrow mb-4 text-paper/70">{t("contact.eyebrow")}</p>
              <AnimatedText value={t("contact.title")} as="h2" className="heading-xl text-paper" />
            </RevealItem>
            <RevealItem>
              <AnimatedText
                value={t("contact.copy")}
                as="p"
                className="body-large mt-7 max-w-[680px] text-paper/78"
              />
            </RevealItem>
            <RevealItem>
              <div className="mt-9 flex flex-wrap gap-4">
                <MotionButton
                  href="mailto:aubierge7557@gmail.com"
                  variant="secondary"
                  className="border-paper bg-paper text-ink hover:border-paper hover:text-maroon"
                >
                  {t("contact.primary")}
                </MotionButton>
                <MotionButton
                  href={githubUrl}
                  variant="secondary"
                  className="border-paper bg-maroon text-paper hover:border-paper hover:text-paper"
                >
                  {t("contact.secondary")}
                </MotionButton>
              </div>
            </RevealItem>
          </div>
          <RevealItem>
            <div className="mb-5 grid gap-3 border-l-2 border-paper pl-4 text-sm font-medium">
              <a href="mailto:aubierge7557@gmail.com" className="underline-offset-4 hover:underline">
                {t("contact.emailLabel")} · aubierge7557@gmail.com
              </a>
              <a href={githubUrl} className="underline-offset-4 hover:underline">
                {t("contact.githubLabel")} · github.com/Aubierge-codes
              </a>
              <p className="text-paper/72">{t("contact.linkedinPending")}</p>
            </div>
            <form className="border-2 border-paper p-5" aria-label={t("form.aria")}>
              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium">{t("form.name")}</span>
                <input
                  name="name"
                  className="min-h-12 w-full border border-paper bg-transparent px-3 text-paper placeholder:text-paper/55"
                  autoComplete="name"
                />
              </label>
              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium">{t("form.email")}</span>
                <input
                  name="email"
                  type="email"
                  className="min-h-12 w-full border border-paper bg-transparent px-3 text-paper placeholder:text-paper/55"
                  autoComplete="email"
                />
              </label>
              <label className="mb-5 block">
                <span className="mb-2 block text-sm font-medium">{t("form.message")}</span>
                <textarea
                  name="message"
                  className="min-h-32 w-full resize-y border border-paper bg-transparent px-3 py-3 text-paper"
                />
              </label>
              <button
                type="button"
                className="min-h-12 border border-paper bg-paper px-5 text-sm font-medium text-ink transition hover:text-maroon"
              >
                {t("form.send")}
              </button>
              <p className="mt-4 text-sm leading-6 text-paper/70">{t("form.note")}</p>
            </form>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
