"use client";

import { useEffect, useState } from "react";
import { useReducedMotion as useMotionPreference } from "framer-motion";

/**
 * prefers-reduced-motion, reported only once the client has mounted.
 *
 * framer-motion's hook reads a media query, which has no answer during SSR.
 * Components across this app branch on it — some choosing different markup
 * entirely, like swapping a canvas for a static fallback — so consulting it
 * during the first render makes the server and client disagree and trips
 * hydration (React #418) for every visitor who actually has the preference
 * set. The people relying on the setting were the only ones seeing the error.
 *
 * Reporting `false` until mounted keeps the first paint identical on both
 * sides; the real preference is applied on the next render, which is a normal
 * client update rather than a hydration mismatch.
 */
export function useReducedMotion(): boolean {
  const preference = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? Boolean(preference) : false;
}
