"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PMREMGenerator, type Texture } from "three";
import { RoomEnvironment } from "three-stdlib";
import { tuneRenderer } from "@/components/three/three-frame";

/**
 * A neutral, offline studio environment (no HDRI fetch, no network
 * dependency) so metallic/PBR materials — the hardware models use
 * fairly high metalness — pick up soft reflections instead of rendering
 * flat black under plain ambient + directional lighting. Shared by
 * ThreeFrame so every model gets the same, coherent lighting treatment.
 */
export function SceneEnvironment() {
  const gl = useThree((state) => state.gl);

  const texture = useMemo<Texture>(() => {
    // This compiles during render, before Canvas#onCreated has run.
    tuneRenderer({ gl });
    const pmrem = new PMREMGenerator(gl);
    const renderTarget = pmrem.fromScene(RoomEnvironment(), 0.035);
    pmrem.dispose();
    return renderTarget.texture;
  }, [gl]);

  return (
    <Environment map={texture} background={false} environmentIntensity={1} />
  );
}
