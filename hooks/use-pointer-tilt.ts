"use client";

import { useMotionValue, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

export function usePointerTilt(enabled: boolean) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, {
    stiffness: 220,
    damping: 18,
    mass: 0.6
  });
  const springY = useSpring(rotateY, {
    stiffness: 220,
    damping: 18,
    mass: 0.6
  });

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -4);
    rotateY.set(px * 4);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: enabled
      ? { rotateX: springX, rotateY: springY, transformPerspective: 900 }
      : undefined,
    onPointerMove,
    onPointerLeave
  };
}
