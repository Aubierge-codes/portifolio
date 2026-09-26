"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial
} from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { useGroundedModel } from "@/hooks/use-grounded-model";
import { MODEL_PATHS, MODEL_SCALE } from "@/components/three/model-config";

const SCALE = MODEL_SCALE.laptop;
const SCREEN_GLOW = 0.55;
/** The source model's RGB keyboard lighting, toned down from its authored full blast. */
const ACCENT_GLOW = 0.12;

export function LaptopModel() {
  const { scene } = useGLTF(MODEL_PATHS.laptop);
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    {
      baseScale: SCALE,
      hoverScale: 1.03
    }
  );

  useGroundedModel(groupRef, innerRef, [scene]);

  // The optimizer merged this model's 14 materials down to 5 palette entries,
  // so there's no "screen" material to match by name. Instead the display is
  // found geometrically: among the meshes, it's the broad, thin panel sitting
  // in the upper half of the model. Lighting that one makes the laptop read as
  // powered on rather than relying on a floating light placed near it.
  useEffect(() => {
    const bounds = new Box3().setFromObject(scene);
    const size = bounds.getSize(new Vector3());
    const midY = bounds.min.y + size.y * 0.45;

    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      const material = mesh.material as MeshStandardMaterial;
      if (!material) return;

      mesh.geometry.computeBoundingBox();
      const meshBounds = mesh.geometry.boundingBox;
      if (!meshBounds) return;
      const meshSize = meshBounds.getSize(new Vector3());
      const center = meshBounds.getCenter(new Vector3());

      const thinnestAxis = Math.min(meshSize.x, meshSize.y, meshSize.z);
      const largestAxis = Math.max(meshSize.x, meshSize.y, meshSize.z);
      const isPanel = thinnestAxis < largestAxis * 0.12;
      const isUpper = center.y > midY;

      if (isPanel && isUpper) {
        material.emissiveIntensity = SCREEN_GLOW;
        if (material.emissive) material.emissive.setRGB(1, 1, 1);
        if (material.map) material.emissiveMap = material.map;
      } else if (material.emissiveIntensity > ACCENT_GLOW) {
        // Rein in the model's authored RGB accent lighting.
        material.emissiveIntensity = ACCENT_GLOW;
      }
      material.needsUpdate = true;
    });
  }, [scene]);

  return (
    <group
      ref={groupRef}
      rotation={[0, -0.5, 0]}
      scale={SCALE}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.laptop);
