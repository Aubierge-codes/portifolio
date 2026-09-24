"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const nodes = [
  { label: "Pi", x: "12%", y: "28%" },
  { label: "ESP", x: "38%", y: "18%" },
  { label: "Arduino", x: "64%", y: "30%" },
  { label: "Sensor", x: "22%", y: "62%" },
  { label: "ML", x: "72%", y: "64%" }
];

/**
 * Abstract node diagram used as the fallback for EmbeddedHardwareCanvas:
 * shown while the 3D bundle loads, when prefers-reduced-motion is set, and
 * whenever WebGL/the GLB scene can't render.
 */
export function EmbeddedDiagram() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative min-h-[280px] border border-ink bg-paper"
      aria-hidden="true"
    >
      {nodes.map((node, index) => (
        <motion.button
          key={node.label}
          type="button"
          tabIndex={-1}
          className="absolute min-h-11 border border-ink bg-paper px-3 text-xs uppercase tracking-[0.12em]"
          style={{ left: node.x, top: node.y }}
          animate={reduceMotion ? undefined : { y: [0, index % 2 ? -6 : 5, 0] }}
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 2.6 + index * 0.2, repeat: Infinity }}
        >
          {node.label}
        </motion.button>
      ))}
      <motion.span
        className="absolute left-[18%] top-[40%] h-px w-[54%] bg-maroon origin-left"
        animate={reduceMotion ? undefined : { scaleX: [0.3, 1, 0.3] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      />
    </div>
  );
}
