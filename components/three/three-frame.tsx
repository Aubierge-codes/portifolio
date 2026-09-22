"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

type ThreeFrameProps = {
  children: React.ReactNode;
  className?: string;
  fallback: React.ReactNode;
};

export function ThreeFrame({ children, className, fallback }: ThreeFrameProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div className={cn("relative", className)}>
      <Canvas
        camera={{ position: [0, 1.1, 4.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[2.4, 3, 2]} intensity={0.7} />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 border border-ink/15" />
    </div>
  );
}
