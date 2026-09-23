"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";

/**
 * Motion rigs for the GLB product scenes. These live inside ThreeFrame's
 * Canvas, which already swaps to a static fallback when the visitor prefers
 * reduced motion — so nothing in here runs in that case and no extra guard
 * is needed.
 */

type TurntableProps = {
  children: React.ReactNode;
  /** Seconds per full revolution. Long on purpose — this should read as drift. */
  period?: number;
  /** Starting angle, so several turntables don't move in lockstep. */
  offset?: number;
  /** Rotate back and forth across this arc (radians) instead of full circles. */
  sweep?: number;
};

/**
 * Slow rotation for a showcased object. With `sweep` it eases back and forth
 * across a limited arc instead of spinning all the way around, which keeps
 * hardware readable from its good side rather than presenting its back half.
 */
export function Turntable({
  children,
  period = 48,
  offset = 0,
  sweep
}: TurntableProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() / period + offset;
    ref.current.rotation.y = sweep
      ? Math.sin(t * Math.PI * 2) * sweep
      : t * Math.PI * 2;
  });

  return <group ref={ref}>{children}</group>;
}

type FloatProps = {
  children: React.ReactNode;
  /** Vertical travel in world units. Keep small — this is a breath, not a bounce. */
  amplitude?: number;
  /** Seconds per rise-and-fall cycle. */
  period?: number;
  offset?: number;
  /** Degrees of gentle tilt paired with the rise, for a little life. */
  tilt?: number;
};

type ScrollTiltProps = {
  children: React.ReactNode;
  /** Radians of yaw swept across the full scroll pass. */
  yaw?: number;
  /** Radians of pitch swept across the full scroll pass. */
  pitch?: number;
  /** World units of vertical drift across the full scroll pass. */
  lift?: number;
};

/**
 * Parallax driven by the canvas's own position in the viewport, so the scene
 * turns slightly as the visitor scrolls past it.
 *
 * Reads the canvas rect directly inside the render loop rather than bridging
 * a DOM scroll listener into React state — no re-renders, and nothing that
 * can disagree between server and client render. The measurement is throttled
 * to every fourth frame since a layout read per frame isn't worth it for an
 * effect this subtle.
 */
export function ScrollTilt({
  children,
  yaw = 0.22,
  pitch = 0.06,
  lift = 0.12
}: ScrollTiltProps) {
  const ref = useRef<Group>(null);
  const canvas = useThree((state) => state.gl.domElement);
  const progress = useRef(0.5);
  const frame = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;

    if (frame.current++ % 4 === 0) {
      const rect = canvas.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // 0 when the canvas is entering from the bottom, 1 when it has left the top.
      const raw = (viewport - rect.top) / (viewport + rect.height);
      progress.current = Math.min(1, Math.max(0, raw));
    }

    const centered = progress.current - 0.5;
    const ease = Math.min(1, delta * 4);
    ref.current.rotation.y += (centered * yaw - ref.current.rotation.y) * ease;
    ref.current.rotation.x += (centered * pitch - ref.current.rotation.x) * ease;
    ref.current.position.y += (-centered * lift - ref.current.position.y) * ease;
  });

  return <group ref={ref}>{children}</group>;
}

/** Subtle vertical drift, so static props don't feel frozen. */
export function Float({
  children,
  amplitude = 0.04,
  period = 6,
  offset = 0,
  tilt = 0
}: FloatProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() / period + offset) * Math.PI * 2;
    ref.current.position.y = Math.sin(t) * amplitude;
    if (tilt) {
      ref.current.rotation.z = Math.sin(t * 0.7) * tilt;
      ref.current.rotation.x = Math.cos(t * 0.5) * tilt * 0.6;
    }
  });

  return <group ref={ref}>{children}</group>;
}
