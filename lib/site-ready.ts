"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny shared state for the opening sequence.
 *
 * - `heroReady`: the hero scene has drawn its first frame (or settled on its
 *   static fallback), so lifting the loader won't reveal an empty strip.
 * - `entered`: the loader has finished leaving, so the hero can start its
 *   intro without it playing out underneath the overlay.
 *
 * Both start false on the server and on the client's first render, so reading
 * them can't cause a hydration mismatch.
 */

let heroReady = false;
let entered = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function markHeroReady() {
  if (heroReady) return;
  heroReady = true;
  emit();
}

export function markSiteEntered() {
  if (entered) return;
  entered = true;
  emit();
}

const serverSnapshot = () => false;

export function useHeroReady() {
  return useSyncExternalStore(subscribe, () => heroReady, serverSnapshot);
}

export function useSiteEntered() {
  return useSyncExternalStore(subscribe, () => entered, serverSnapshot);
}
