"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import { cn } from "@/lib/utils";

/**
 * A mono annotation anchored in a chapter. drei's Html ignores 3D
 * visibility, so this hides itself whenever its chapter set is hidden,
 * otherwise a far-away set's labels would leak into other shots.
 */
export function ChapterLabel({
  at,
  children,
  tone = "ink"
}: {
  at: [number, number, number];
  children: React.ReactNode;
  tone?: "ink" | "paper";
}) {
  const anchor = useRef<Group>(null);
  const el = useRef<HTMLDivElement>(null);
  useFrame(() => {
    let shown = true;
    for (
      let o = anchor.current as Group | null;
      o;
      o = o.parent as Group | null
    ) {
      if (!o.visible) {
        shown = false;
        break;
      }
    }
    if (el.current) el.current.style.visibility = shown ? "visible" : "hidden";
  });
  return (
    <group ref={anchor}>
      <Html ref={el} position={at} center zIndexRange={[10, 0]}>
        <span
          className={cn(
            "pointer-events-none whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em]",
            tone === "ink" ? "text-ink/70" : "text-paper/80"
          )}
        >
          {children}
        </span>
      </Html>
    </group>
  );
}
