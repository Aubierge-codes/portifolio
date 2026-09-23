"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { PMREMGenerator, type Texture } from "three";
import { RoomEnvironment } from "three-stdlib";

/**
 * A neutral, offline studio environment (no HDRI fetch, no network
 * dependency) so metallic/PBR materials — several of the GLB imports use
 * fairly high metalness — pick up soft reflections instead of rendering
 * flat black under plain ambient + directional lighting. Shared by
 * ThreeFrame so every model gets the same, coherent lighting treatment.
 */
export function SceneEnvironment() {
  const gl = useThree((state) => state.gl);

  const texture = useMemo<Texture>(() => {
    const pmrem = new PMREMGenerator(gl);
    const renderTarget = pmrem.fromScene(RoomEnvironment(), 0.035);
    pmrem.dispose();
    return renderTarget.texture;
  }, [gl]);

  return <Environment map={texture} background={false} environmentIntensity={1} />;
}
