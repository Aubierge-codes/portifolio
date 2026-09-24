"use client";

import { Canvas } from "@react-three/fiber";

import { Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ThreeFrameProps = {
  children: React.ReactNode;
  className?: string;
  fallback: React.ReactNode;
  /** Skip the opaque white background and border frame, letting the page show through. */
  transparent?: boolean;
  /** Skip the default ambient/directional pair so the scene can light itself. */
  lights?: boolean;
};

/** How far outside the viewport a scene starts rendering, so it's ready on arrival. */
const PRELOAD_MARGIN = "500px 0px";

export function ThreeFrame({
  children,
  className,
  fallback,
  transparent = false,
  lights = true
}: ThreeFrameProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  /**
   * Only run a WebGL context while the frame is near the viewport.
   *
   * The page carries roughly fifteen of these scenes. Mounted all at once they
   * sat right at the browser's simultaneous-context ceiling — past which the
   * oldest context is dropped and a canvas goes blank — and every off-screen
   * scene still ran a full render loop. Gating on intersection keeps only the
   * handful in view alive.
   *
   * `near` is false on both the server and the client's first render, so
   * there's nothing for hydration to disagree about.
   */
  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The hook reports false until mounted, so this branch can't desync
  // the first render from the server's markup.
  if (reduceMotion) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <div ref={host} className={cn("relative", className)}>
      {near ? (
        <Canvas
          camera={{ position: [0, 1.1, 4.2], fov: 38 }}
          // Phones pay for every extra pixel twice over: high device ratios
          // multiply the work, and they have the least GPU to do it with.
          // Capping the ratio and dropping MSAA there costs little at the size
          // these scenes actually render.
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          {transparent ? null : (
            <color attach="background" args={["#ffffff"]} />
          )}
          {lights ? (
            <>
              <ambientLight intensity={0.85} />
              <directionalLight position={[2.4, 3, 2]} intensity={0.7} />
            </>
          ) : null}
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : (
        fallback
      )}
      {transparent ? null : (
        <div className="pointer-events-none absolute inset-0 border border-ink/15" />
      )}
    </div>
  );
}
