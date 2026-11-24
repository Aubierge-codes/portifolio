"use client";

import { useEffect } from "react";
import { restoreSound, setSound, useSound } from "@/lib/sound";

/** Speaker toggle for the optional sound. Off by default; remembered per device. */
export function SoundToggle({ label }: { label: string }) {
  const on = useSound();
  useEffect(() => restoreSound(), []);
  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={label}
      title={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-ink/70 transition-colors hover:text-ink"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path
          d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"
          fill="currentColor"
          stroke="none"
        />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" strokeLinecap="round" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" strokeLinecap="round" />
          </>
        ) : (
          <path d="M16 9.5l5 5m0-5l-5 5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
