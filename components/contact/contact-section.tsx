"use client";

import { FormEvent, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { githubUrl } from "@/data/projects";
import { cn, emailAddress } from "@/lib/utils";
import { AnimatedText } from "@/components/motion/animated-text";
import { SpringButton } from "@/components/motion/spring-button";
import { Reveal, RevealItem } from "@/components/motion/reveal";
import { LineCharacter } from "@/components/characters/line-character";
import { BouncingBall } from "@/components/motion/bouncing-ball";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";
import { Lamp } from "@/components/three/lamp";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { TranslationKey } from "@/types/content";

type ContactSectionProps = {
  t: (key: TranslationKey) => string;
};

export function ContactSection({ t }: ContactSectionProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // Matches the grid's own lg: breakpoint, where the two-column layout
  // (and the empty space the corner lamp relies on) collapses to one.
  const isStackedLayout = useIsMobile("(max-width: 1023px)");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const [hit, setHit] = useState(false);
  const [sent, setSent] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);

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
      style={{ backgroundColor: isLampOn ? "#1a1816" : "#030303" }}
      className={cn(
        "relative overflow-hidden pb-28 pt-24 text-paper md:pb-32 md:pt-32",
        !reduceMotion && "transition-colors duration-700"
      )}
    >
      <div className="section-shell relative z-10">
        <Reveal
          stagger
          className="grid gap-10 lg:grid-cols-[0.72fr_0.42fr] lg:items-start"
        >
          <div>
            <RevealItem>
              <p className="eyebrow mb-4 text-paper/60">
                {t("contact.eyebrow")}
              </p>
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
            {isStackedLayout ? (
              <div className="relative -ml-2 mt-8 h-56 w-56" aria-hidden="true">
                <ThreeFrame
                  transparent
                  className="h-full w-full"
                  fallback={<div />}
                >
                  <Lamp
                    isOn={isLampOn}
                    onToggle={() => setIsLampOn((value) => !value)}
                  />
                </ThreeFrame>
              </div>
            ) : null}
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

      <button
        type="button"
        onClick={() => setIsLampOn((value) => !value)}
        aria-pressed={isLampOn}
        className="sr-only"
      >
        {isLampOn ? "Turn lamp off" : "Turn lamp on"}
      </button>

      {isStackedLayout ? null : (
        <LampCorner
          isOn={isLampOn}
          onToggle={() => setIsLampOn((value) => !value)}
        />
      )}
      <ContactCanvas isMobile={isMobile} />
    </section>
  );
}

function RunningMannequins({ isMobile }: { isMobile: boolean }) {
  const char1 = useRef<Group>(null);
  const char2 = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (char1.current) {
      const x = ((t * 1.5) % 12) - 6;
      char1.current.position.x = x;
    }
    if (char2.current && !isMobile) {
      const x = (((t - 0.5) * 1.4) % 12) - 6;
      char2.current.position.x = x;
    }
  });

  return (
    <group position={[0, -0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
      <group ref={char1} position={[-6, 0, -0.5]}>
        <Mannequin pose="walk" carry="flag" speed={4} />
      </group>
      {!isMobile && (
        <group ref={char2} position={[-6, 0, 0.5]}>
          <Mannequin pose="walk" hair="bun" speed={4.2} accent />
        </group>
      )}
    </group>
  );
}

function LampCorner({
  isOn,
  onToggle
}: {
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="absolute bottom-44 left-4 z-20 h-52 w-52 sm:left-8 sm:h-64 sm:w-64 lg:left-14 lg:h-80 lg:w-80"
      aria-hidden="true"
    >
      <ThreeFrame transparent className="h-full w-full" fallback={<div />}>
        <Lamp isOn={isOn} onToggle={onToggle} />
      </ThreeFrame>
    </div>
  );
}

function ContactCanvas({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-paper"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-ink/20" />
      <ThreeFrame className="h-full w-full" fallback={<div />}>
        <RunningMannequins isMobile={isMobile} />
      </ThreeFrame>
    </div>
  );
}
