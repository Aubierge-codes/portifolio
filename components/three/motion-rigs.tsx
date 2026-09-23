"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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
