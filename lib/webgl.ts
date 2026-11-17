let supported: boolean | undefined;

/**
 * Whether this browser can create a WebGL context at all. Checked once and
 * cached, client-side only.
 *
 * R3F creates its renderer asynchronously, so a missing context surfaces as
 * an unhandled rejection rather than an error a boundary can catch, leaving a
 * blank canvas. Asking first lets scenes render their static fallback instead.
 */
export function hasWebGL() {
  if (supported !== undefined) return supported;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    supported = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    supported = false;
  }
  return supported;
}
