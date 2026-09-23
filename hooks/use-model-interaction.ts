"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { Group } from "three";

type UseModelInteractionOptions = {
  /** Resting scale the model settles back to. */
  baseScale: number;
  /** Multiplier applied on top of baseScale while hovered. */
  hoverScale?: number;
  /** Scale multiplier applied for one settle cycle right after a click. */
  pressScale?: number;
  /** How quickly the scale eases toward its target (higher = snappier). */
  speed?: number;
  /** Called when the model is clicked/tapped, after the press animation starts. */
  onClick?: () => void;
};

/**
 * Shared hover/press/cursor behavior for small decorative or interactive
 * GLB accents: settles to baseScale, bumps slightly on hover, gives a
 * subtle press-and-settle pulse on click, and swaps the cursor to a
 * pointer while hovered. Keeps this logic out of every individual model
 * component (Lamp, Laptop, Arduino, Raspberry Pi, Robot Arm all use it).
 */
export function useModelInteraction<T extends Group>(
  groupRef: React.RefObject<T | null>,
  {
    baseScale,
    hoverScale = 1.03,
    pressScale = 0.93,
    speed = 10,
    onClick
  }: UseModelInteractionOptions
) {
  const [hovered, setHovered] = useState(false);
  const pressRef = useRef(1);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const settleAmt = Math.min(1, delta * speed);
    pressRef.current += (1 - pressRef.current) * settleAmt;
    if (groupRef.current) {
      const target = baseScale * pressRef.current * (hovered ? hoverScale : 1);
      groupRef.current.scale.x += (target - groupRef.current.scale.x) * settleAmt;
      groupRef.current.scale.y = groupRef.current.scale.x;
      groupRef.current.scale.z = groupRef.current.scale.x;
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => setHovered(false);

  const handleClick = onClick
    ? (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        pressRef.current = pressScale;
        onClick();
      }
    : undefined;

  return { hovered, handlePointerOver, handlePointerOut, handleClick };
}
