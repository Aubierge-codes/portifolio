"use client";

import { useLayoutEffect, type RefObject } from "react";
import {
  Box3,
  Matrix3,
  Quaternion,
  Vector3,
  type Group,
  type Mesh
} from "three";

const UP = new Vector3(0, 1, 0);

/** Smallest-variance axis of a point cloud — for a board, its face normal. */
function dominantPlaneNormal(points: Vector3[]): Vector3 | null {
  if (points.length < 16) return null;

  const mean = new Vector3();
  for (const p of points) mean.add(p);
  mean.divideScalar(points.length);

  let xx = 0,
    xy = 0,
    xz = 0,
    yy = 0,
    yz = 0,
    zz = 0;
  for (const p of points) {
    const dx = p.x - mean.x;
    const dy = p.y - mean.y;
    const dz = p.z - mean.z;
    xx += dx * dx;
    xy += dx * dy;
    xz += dx * dz;
    yy += dy * dy;
    yz += dy * dz;
    zz += dz * dz;
  }
  const n = points.length;
  const trace = (xx + yy + zz) / n;
  if (trace === 0) return null;

  // Power-iterate on (trace*I - covariance) so the dominant eigenvector of the
  // shifted matrix is the *smallest* eigenvector of the covariance.
  const shifted = new Matrix3().set(
    trace - xx / n,
    -xy / n,
    -xz / n,
    -xy / n,
    trace - yy / n,
    -yz / n,
    -xz / n,
    -yz / n,
    trace - zz / n
  );

  const v = new Vector3(0.31, 0.67, 0.22).normalize();
  for (let i = 0; i < 64; i++) {
    v.applyMatrix3(shifted);
    if (v.lengthSq() === 0) return null;
    v.normalize();
  }
  return v;
}

type Options = {
  /**
   * Rotate the model so its dominant plane lies flat. For board-like assets
   * exported at an arbitrary angle, this beats hand-tuning Euler values.
   */
  autoLevel?: boolean;
};

/**
 * Centers a loaded GLB on x/z and sits it flush on y = 0, measured from the
 * model as it actually renders — optionally leveling it first.
 *
 * These files come from different sources with arbitrary authored transforms;
 * the Raspberry Pi export, for instance, has a tilt quaternion and a 45x scale
 * baked into its only node, so it lands standing on edge. Measuring at mount
 * keeps models planted regardless of what the source file or the asset
 * optimizer did to the transforms.
 *
 * `inner` carries the corrective transform; `outer` carries scale and supplies
 * the frame the measurement is expressed in.
 */
export function useGroundedModel(
  outer: RefObject<Group | null>,
  inner: RefObject<Group | null>,
  deps: unknown[] = [],
  { autoLevel = false }: Options = {}
) {
  useLayoutEffect(() => {
    const outerGroup = outer.current;
    const innerGroup = inner.current;
    if (!outerGroup || !innerGroup) return;

    innerGroup.position.set(0, 0, 0);
    innerGroup.quaternion.identity();
    outerGroup.updateWorldMatrix(true, true);

    if (autoLevel) {
      const points: Vector3[] = [];
      innerGroup.traverse((child) => {
        const mesh = child as Mesh;
        const attr = mesh.isMesh
          ? mesh.geometry?.getAttribute("position")
          : undefined;
        if (!attr) return;
        // Sample rather than read every vertex; the plane fit converges fast.
        const step = Math.max(1, Math.floor(attr.count / 900));
        for (let i = 0; i < attr.count; i += step) {
          points.push(
            new Vector3(attr.getX(i), attr.getY(i), attr.getZ(i)).applyMatrix4(
              mesh.matrixWorld
            )
          );
        }
      });

      const normal = dominantPlaneNormal(points);
      if (normal) {
        if (normal.dot(UP) < 0) normal.negate();
        innerGroup.quaternion.premultiply(
          new Quaternion().setFromUnitVectors(normal, UP)
        );
        innerGroup.updateWorldMatrix(true, true);
      }
    }

    const box = new Box3().setFromObject(innerGroup);
    if (box.isEmpty()) return;

    // Express the measurement in the outer group's frame, since that's the
    // space the inner group's position is applied in.
    box.applyMatrix4(outerGroup.matrixWorld.clone().invert());

    const center = box.getCenter(new Vector3());
    innerGroup.position.set(-center.x, -box.min.y, -center.z);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
