"use client";

import { FormEvent, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { githubUrl } from "@/data/projects";
import { emailAddress } from "@/lib/utils";
import { AnimatedText } from "@/components/motion/animated-text";
import { SpringButton } from "@/components/motion/spring-button";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { LineCharacter } from "@/components/characters/line-character";
import { BouncingBall } from "@/components/motion/bouncing-ball";
import { useIsMobile } from "@/hooks/use-is-mobile";
import type { TranslationKey } from "@/types/content";

type ContactSectionProps = {
  t: (key: TranslationKey) => string;
};

export function ContactSection({ t }: ContactSectionProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const [hit, setHit] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const body = encodeURIComponent(`${name} · ${email}\n\n${message}`);
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent("Portfolio conversation")}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-ink pb-28 pt-24 text-paper md:pb-32 md:pt-32"
    >
      <div className="section-shell relative z-10">
        <Reveal
          stagger
          className="grid gap-10 lg:grid-cols-[0.72fr_0.42fr] lg:items-start"
        >
          <div>
            <RevealItem>
              <p className="eyebrow mb-4 text-paper/60">{t("contact.eyebrow")}</p>
              <AnimatedText
                value={t("contact.title")}
                as="h2"
                className="heading-xl text-paper"
              />
            </RevealItem>
            <RevealItem>
              <AnimatedText
                value={t("contact.copy")}
                as="p"
                className="body-large mt-7 max-w-[680px] text-paper/75"
              />
            </RevealItem>
            <RevealItem>
              <div className="relative mt-9 flex flex-wrap gap-4">
                <SpringButton
                  href={`mailto:${emailAddress}`}
                  variant="paper"
                  hit={hit}
                >
                  {t("contact.primary")}
                </SpringButton>
                <SpringButton
                  href={githubUrl}
                  variant="secondary"
                  className="border-paper bg-ink text-paper hover:border-paper hover:text-paper"
                >
                  {t("contact.secondary")}
                </SpringButton>
                {inView ? (
                  <span className="absolute -bottom-10 left-40 hidden sm:block">
                    <BouncingBall />
                  </span>
                ) : null}
              </div>
            </RevealItem>
          </div>
          <RevealItem>
            <div className="mb-5 grid gap-3 border-l border-paper/40 pl-4 text-sm">
              <a
                href={`mailto:${emailAddress}`}
                className="min-h-11 inline-flex items-center underline-offset-4 hover:underline"
              >
                {t("contact.emailLabel")} · {emailAddress}
              </a>
              <a
                href={githubUrl}
                className="min-h-11 inline-flex items-center underline-offset-4 hover:underline"
              >
                {t("contact.githubLabel")} · github.com/Aubierge-codes
              </a>
              <p className="text-paper/65">{t("contact.linkedinPending")}</p>
            </div>
            <form
              className="border border-paper p-5"
              aria-label={t("form.aria")}
              onSubmit={onSubmit}
            >
              <label className="mb-4 block">
                <span className="mb-2 block text-sm">{t("form.name")}</span>
                <input
                  name="name"
                  required
                  className="min-h-12 w-full border border-paper bg-transparent px-3 text-paper"
                  autoComplete="name"
                />
              </label>
              <label className="mb-4 block">
                <span className="mb-2 block text-sm">{t("form.email")}</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="min-h-12 w-full border border-paper bg-transparent px-3 text-paper"
                  autoComplete="email"
                />
              </label>
              <label className="mb-5 block">
                <span className="mb-2 block text-sm">{t("form.message")}</span>
                <textarea
                  name="message"
                  required
                  className="min-h-32 w-full resize-y border border-paper bg-transparent px-3 py-3 text-paper"
                />
              </label>
              <SpringButton
                type="submit"
                variant="paper"
                onClick={() => setHit(true)}
              >
                {t("form.send")}
              </SpringButton>
              <p className="mt-4 text-sm leading-6 text-paper/65">
                {sent ? t("form.sent") : t("form.note")}
              </p>
            </form>
          </RevealItem>
        </Reveal>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-paper" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-ink/20" />
        <motion.div
          className="absolute bottom-0 w-20"
          animate={
            reduceMotion || !inView
              ? { x: "8%" }
              : { x: isMobile ? ["-10%", "70%"] : ["-10%", "88%"] }
          }
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
        >
          <LineCharacter pose={reduceMotion ? "idle" : "run"} carry="ball" duration={0.4} />
        </motion.div>
        {isMobile ? null : (
          <motion.div
            className="absolute bottom-0 w-20"
            animate={
              reduceMotion || !inView ? { x: "18%" } : { x: ["-24%", "78%"] }
            }
            transition={{ duration: 7.4, repeat: Infinity, ease: "linear", delay: 0.5 }}
          >
            <LineCharacter pose="run" carry="flag" hair="bun" duration={0.48} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
