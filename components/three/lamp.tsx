"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  AdditiveBlending,
  Color,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  type PointLight
} from "three";

type LampProps = {
  isOn: boolean;
  onToggle: () => void;
};

const WARM_COLOR = "#ffcf8a";
const BULB_LOCAL_POSITION: [number, number, number] = [0, 0.72, 0.61];
const MODEL_SCALE = 1.3;
const MODEL_POSITION: [number, number, number] = [0, -0.575, -0.524];

const ON_LIGHT_INTENSITY = 5;
const ON_EMISSIVE_INTENSITY = 2.2;
const HOVER_STANDBY_EMISSIVE = 0.3;
const GLOW_OPACITY_INNER = 0.28;
const GLOW_OPACITY_OUTER = 0.14;
const TRANSITION_SPEED = 4.5; // ~1/TRANSITION_SPEED sec time constant, settles within the 400-800ms window
const SETTLE_SPEED = 10;

function isBulbOrGlassMaterial(material: MeshStandardMaterial) {
  const name = material.name?.toLowerCase() ?? "";
  return (
    name.includes("bulb") ||
    name.includes("glass") ||
    name.includes("light") ||
    name.includes("emission")
  );
}

export function Lamp({ isOn, onToggle }: LampProps) {
  const { scene } = useGLTF("/lamp.glb");
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const glowInnerRef = useRef<Mesh>(null);
  const glowOuterRef = useRef<Mesh>(null);
  const emissiveMaterials = useRef<MeshStandardMaterial[]>([]);
  const [hovered, setHovered] = useState(false);
  const pressRef = useRef(1);

  useEffect(() => {
    const found: MeshStandardMaterial[] = [];
    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as MeshStandardMaterial;
      if (material && isBulbOrGlassMaterial(material)) {
        material.emissive = new Color(WARM_COLOR);
        material.emissiveIntensity = 0;
        found.push(material);
      }
    });
    emissiveMaterials.current = found;
  }, [scene]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const lerpAmt = 1 - Math.exp(-TRANSITION_SPEED * delta);
    const standby = hovered && !isOn ? HOVER_STANDBY_EMISSIVE : 0;
    const targetEmissive = isOn ? ON_EMISSIVE_INTENSITY : standby;
    const targetLight = isOn ? ON_LIGHT_INTENSITY : 0;
    const targetGlowInner = isOn ? GLOW_OPACITY_INNER : 0;
    const targetGlowOuter = isOn ? GLOW_OPACITY_OUTER : 0;

    emissiveMaterials.current.forEach((material) => {
      material.emissiveIntensity +=
        (targetEmissive - material.emissiveIntensity) * lerpAmt;
    });

    if (lightRef.current) {
      lightRef.current.intensity +=
        (targetLight - lightRef.current.intensity) * lerpAmt;
    }

    const innerMaterial = glowInnerRef.current?.material as
      MeshBasicMaterial | undefined;
    if (innerMaterial) {
      innerMaterial.opacity +=
        (targetGlowInner - innerMaterial.opacity) * lerpAmt;
    }
    const outerMaterial = glowOuterRef.current?.material as
      MeshBasicMaterial | undefined;
    if (outerMaterial) {
      outerMaterial.opacity +=
        (targetGlowOuter - outerMaterial.opacity) * lerpAmt;
    }

    const settleAmt = Math.min(1, delta * SETTLE_SPEED);
    pressRef.current += (1 - pressRef.current) * settleAmt;
    if (groupRef.current) {
      const targetScale = MODEL_SCALE * pressRef.current * (hovered ? 1.03 : 1);
      groupRef.current.scale.x +=
        (targetScale - groupRef.current.scale.x) * settleAmt;
      groupRef.current.scale.y = groupRef.current.scale.x;
      groupRef.current.scale.z = groupRef.current.scale.x;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    pressRef.current = 0.93;
    onToggle();
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = () => setHovered(false);

  return (
    <group
      ref={groupRef}
      position={MODEL_POSITION}
      scale={MODEL_SCALE}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={scene} />
      <pointLight
        ref={lightRef}
        position={BULB_LOCAL_POSITION}
        intensity={0}
        color={WARM_COLOR}
        distance={6}
        decay={2}
      />
      <mesh ref={glowInnerRef} position={BULB_LOCAL_POSITION}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial
          color={WARM_COLOR}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={glowOuterRef} position={BULB_LOCAL_POSITION}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial
          color={WARM_COLOR}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/lamp.glb");
