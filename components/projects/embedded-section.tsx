"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { hasWebGL } from "@/lib/webgl";
import { playServo, setRoomTone } from "@/lib/sound";
import { useSiteEntered } from "@/lib/site-ready";
import { cn } from "@/lib/utils";
import type {
  LabAngle,
  LabEnv,
  LabObject,
  Orbit
} from "@/components/lab/lab-canvas";
import type { TranslationKey } from "@/types/content";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";

const LabCanvas = dynamic(
  () => import("@/components/lab/lab-canvas").then((m) => m.LabCanvas),
  { ssr: false, loading: () => null }
);

type Props = { t: (key: TranslationKey) => string };

const OBJECTS: { id: LabObject; name: string }[] = [
  { id: "arduino", name: "Arduino UNO" },
  { id: "pi", name: "Raspberry Pi" },
  { id: "arm", name: "Robot arm" },
  { id: "laptop", name: "Laptop" },
  { id: "monitor", name: "Monitor" }
];

/** Mirrors HOTSPOTS in lab-canvas; kept here so the DOM list needs no 3D chunk. */
const PARTS: Partial<Record<LabObject, { id: string; label: string }[]>> = {
  arduino: [
    { id: "usb", label: "USB-B" },
    { id: "jack", label: "Barrel jack" },
    { id: "mcu", label: "ATmega328P" },
    { id: "digital", label: "Digital I/O" },
    { id: "analog", label: "Analog · Power" }
  ],
  pi: [
    { id: "soc", label: "Broadcom SoC" },
    { id: "usb", label: "USB 2.0 ×4" },
    { id: "eth", label: "Ethernet" },
    { id: "gpio", label: "40-pin GPIO" },
    { id: "hdmi", label: "HDMI" }
  ]
};

/**
 * The Embedded Lab: a dark bench with the real hardware, travelled in three
 * scroll stops, and a product studio for inspecting any object.
 * DESIGN_BLUEPRINT.md §3.4, INTERACTION_SPECIFICATION.md §3–7.
 */
export function EmbeddedSection({ t }: Props) {
  const reduceMotion = useReducedMotion();
  const [webgl, setWebgl] = useState(true);
  useEffect(() => setWebgl(hasWebGL()), []);
  return reduceMotion || !webgl ? <LabStill t={t} /> : <LabStage t={t} />;
}

function LabStage({ t }: Props) {
  const isMobile = useIsMobile();
  const entered = useSiteEntered();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [stop, setStop] = useState(0);
  const [near, setNear] = useState(false);
  const [inspect, setInspect] = useState<LabObject | null>(null);
  const [env, setEnv] = useState<LabEnv>("dark");
  const [angle, setAngle] = useState<LabAngle>("threeQuarter");
  const [focus, setFocus] = useState<string | null>(null);
  const [armRun, setArmRun] = useState(false);
  const [lidClosed, setLidClosed] = useState(false);
  const orbit = useRef<Orbit>({ az: 0, pol: 0, zoom: 1 });

  // The page dims as the lab arrives.
  const { scrollYProgress: arrive } = useScroll({
    target: section,
    offset: ["start end", "start start"]
  });
  const bg = useTransform(arrive, [0.35, 1], ["#ffffff", "#0b0b0d"]);
  const fg = useTransform(arrive, [0.35, 1], ["#030303", "#f2efe8"]);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"]
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    const next = v < 0.36 ? 0 : v < 0.68 ? 1 : 2;
    setStop((s) => (s === next ? s : next));
  });

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        setRoomTone(e.isIntersecting);
        if (!e.isIntersecting) setInspect(null);
      },
      { rootMargin: "60% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setRoomTone(false);
    };
  }, []);

  const open = (o: LabObject) => {
    orbit.current = { az: 0, pol: 0, zoom: 1 };
    setFocus(null);
    setAngle("threeQuarter");
    setInspect(o);
  };
  const close = () => {
    setInspect(null);
    setFocus(null);
    setArmRun(false);
  };

  // Drag to turn (with inertia), wheel or pinch to zoom, only while inspecting.
  useEffect(() => {
    const el = stage.current;
    if (!el || !inspect) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let velocity = { az: 0, pol: 0 };
    let raf = 0;
    let pinch = 0;
    const clampZoom = (z: number) => Math.min(1.6, Math.max(0.55, z));
    const glide = () => {
      if (pointers.size) return;
      velocity = { az: velocity.az * 0.92, pol: velocity.pol * 0.92 };
      orbit.current.az += velocity.az;
      orbit.current.pol += velocity.pol;
      if (Math.abs(velocity.az) + Math.abs(velocity.pol) > 0.002)
        raf = requestAnimationFrame(glide);
    };
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      cancelAnimationFrame(raf);
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      const last = pointers.get(e.pointerId);
      if (!last) return;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [c, dd] = [...pointers.values()];
        const d2 = Math.hypot(c.x - dd.x, c.y - dd.y);
        if (pinch)
          orbit.current.zoom = clampZoom(orbit.current.zoom * (d / d2));
        pinch = d2;
        return;
      }
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      velocity = { az: -dx * 0.0105, pol: -dy * 0.006 };
      orbit.current.az += velocity.az;
      orbit.current.pol += velocity.pol;
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      pinch = 0;
      if (!pointers.size) raf = requestAnimationFrame(glide);
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      orbit.current.zoom = clampZoom(
        orbit.current.zoom * (1 + Math.sign(e.deltaY) * 0.08)
      );
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
    };
  }, [inspect]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!inspect) return;
    const step = (15 * Math.PI) / 180;
    const keys: Record<string, () => void> = {
      Escape: close,
      ArrowLeft: () => (orbit.current.az -= step),
      ArrowRight: () => (orbit.current.az += step),
      ArrowUp: () => (orbit.current.pol -= step),
      ArrowDown: () => (orbit.current.pol += step),
      "+": () =>
        (orbit.current.zoom = Math.max(0.55, orbit.current.zoom * 0.9)),
      "=": () =>
        (orbit.current.zoom = Math.max(0.55, orbit.current.zoom * 0.9)),
      "-": () => (orbit.current.zoom = Math.min(1.6, orbit.current.zoom * 1.1)),
      "1": () => setAngle("front"),
      "2": () => setAngle("threeQuarter"),
      "3": () => setAngle("top"),
      "4": () => setAngle("detail")
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const captions: TranslationKey[] = ["lab.bench", "lab.boards", "lab.arm"];
  // Selected chips invert; colours follow the light (ink on the white studio).
  const light = inspect !== null && env === "studio";
  const chip = (on: boolean) =>
    cn(
      "min-h-9 border px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
      light
        ? on
          ? "border-ink bg-ink text-paper"
          : "border-ink/30 hover:border-ink"
        : on
          ? "border-paper bg-paper text-ink"
          : "border-paper/30 hover:border-paper"
    );

  return (
    <motion.section
      id="lab"
      ref={section}
      aria-labelledby="lab-title"
      className="relative"
      style={{ height: "280svh", backgroundColor: bg, color: fg }}
    >
      <div
        ref={stage}
        tabIndex={inspect ? 0 : -1}
        onKeyDown={onKey}
        className={cn(
          "sticky top-0 h-[100svh] overflow-hidden",
          inspect && "touch-none cursor-grab active:cursor-grabbing"
        )}
      >
        <div className="absolute inset-0" aria-hidden="true">
          {near && entered ? (
            // A model that fails to load shows the still, never a broken page.
            <SceneErrorBoundary
              fallback={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/posters/lab.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                />
              }
            >
              <LabCanvas
                progress={progress}
                stop={stop}
                inspect={inspect}
                env={env}
                angle={angle}
                orbit={orbit}
                focus={focus}
                armPlaying={inspect ? armRun : stop === 2}
                lidClosed={lidClosed}
                onSelect={open}
                onFocus={setFocus}
                isMobile={isMobile}
              />
            </SceneErrorBoundary>
          ) : null}
        </div>

        <div
          className={cn(
            "section-shell pointer-events-none relative flex h-full flex-col justify-between pb-8 pt-24 transition-colors duration-500 md:pb-12 md:pt-28",
            inspect && env === "studio" ? "text-ink" : "text-paper"
          )}
        >
          <AnimatePresence initial={false}>
            {inspect ? null : (
              <motion.div
                key="intro"
                className="max-w-[460px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#c98a8e]">
                  {t("embedded.eyebrow")}
                </p>
                <h2 id="lab-title" className="heading-lg mt-4 !text-inherit">
                  {t("embedded.title")}
                </h2>
                <p className="mt-4 opacity-70">{t("embedded.copy")}</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={stop}
                    className="mt-8 font-mono text-[12px] uppercase tracking-[0.12em] opacity-80"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    {String(stop + 1).padStart(2, "0")} / 03 ·{" "}
                    {t(captions[stop])}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {inspect ? (
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="pointer-events-auto flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                    {t("lab.inspect")}
                  </p>
                  <h3 className="heading-md mt-1 !text-inherit">
                    {OBJECTS.find((o) => o.id === inspect)?.name}
                  </h3>
                </div>
                <button type="button" onClick={close} className={chip(false)}>
                  {t("project.close")} · Esc
                </button>
              </div>
              <div
                className={cn(
                  "pointer-events-auto -mx-3 flex flex-col gap-4 p-3 backdrop-blur-sm",
                  light ? "bg-[#f4f1ec]/75" : "bg-[#0b0b0d]/60"
                )}
              >
                {PARTS[inspect] ? (
                  <div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                      {t("lab.parts")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PARTS[inspect]!.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={focus === p.id}
                          onClick={() => setFocus(focus === p.id ? null : p.id)}
                          className={chip(focus === p.id)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
                  <fieldset className="flex flex-wrap items-center gap-2">
                    <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                      {t("lab.angle")}
                    </legend>
                    {(
                      ["front", "threeQuarter", "top", "detail"] as LabAngle[]
                    ).map((a, i) => (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={angle === a}
                        onClick={() => {
                          orbit.current = { az: 0, pol: 0, zoom: 1 };
                          setAngle(a);
                        }}
                        className={chip(angle === a)}
                      >
                        {i + 1} · {t(`lab.${a}` as TranslationKey)}
                      </button>
                    ))}
                  </fieldset>
                  <fieldset className="flex flex-wrap items-center gap-2">
                    <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                      {t("lab.light")}
                    </legend>
                    {(["studio", "dark", "context"] as LabEnv[]).map((e) => (
                      <button
                        key={e}
                        type="button"
                        aria-pressed={env === e}
                        onClick={() => setEnv(e)}
                        className={chip(env === e)}
                      >
                        {t(`lab.${e}` as TranslationKey)}
                      </button>
                    ))}
                  </fieldset>
                  {inspect === "arm" ? (
                    <button
                      type="button"
                      aria-pressed={armRun}
                      onClick={() => {
                        if (!armRun) playServo(0.5);
                        setArmRun((r) => !r);
                      }}
                      className={chip(armRun)}
                    >
                      {armRun ? t("lab.stop") : t("lab.run")}
                    </button>
                  ) : null}
                  {inspect === "laptop" ? (
                    <button
                      type="button"
                      aria-pressed={lidClosed}
                      onClick={() => setLidClosed((c) => !c)}
                      className={chip(lidClosed)}
                    >
                      {t("lab.lid")}
                    </button>
                  ) : null}
                </div>
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.12em] opacity-50 md:block">
                  {t("lab.hint")}
                </p>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
                {t("lab.inspect")} · {t("lab.objects")}
              </p>
              <div className="flex flex-wrap gap-2">
                {OBJECTS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => open(o.id)}
                    className={chip(false)}
                  >
                    {o.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/** Reduced motion or no WebGL: the bench as a still, with its parts as text. */
function LabStill({ t }: Props) {
  return (
    <section
      id="lab"
      aria-labelledby="lab-title"
      className="bg-[#0b0b0d] py-24 text-paper md:py-32"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#c98a8e]">
            {t("embedded.eyebrow")}
          </p>
          <h2 id="lab-title" className="heading-lg mt-4 !text-inherit">
            {t("embedded.title")}
          </h2>
          <p className="mt-4 text-paper/70">{t("embedded.copy")}</p>
          <dl className="mt-8 grid gap-4 font-mono text-[11px] uppercase tracking-[0.12em]">
            {OBJECTS.filter((o) => PARTS[o.id]).map((o) => (
              <div key={o.id}>
                <dt className="text-paper">{o.name}</dt>
                <dd className="mt-1 text-paper/60">
                  {PARTS[o.id]!.map((p) => p.label).join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/posters/lab.jpg"
          alt=""
          width={1600}
          height={900}
          loading="lazy"
          className="w-full border border-paper/10"
        />
      </div>
    </section>
  );
}
