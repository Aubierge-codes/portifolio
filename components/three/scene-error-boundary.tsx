"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type SceneErrorBoundaryProps = {
  children: ReactNode;
  /** Rendered in place of the scene if it throws. */
  fallback: ReactNode;
};

type SceneErrorBoundaryState = { failed: boolean };

/**
 * Contains failures inside a 3D scene — a GLB that 404s or fails to decode,
 * a browser with WebGL disabled, a lost context during setup — so they swap
 * that one scene for its static fallback instead of unmounting the whole page.
 */
export class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[3D] scene failed, showing fallback:", error, info);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
