"use client";

import {
  LineCharacter,
  type LineCharacterProps
} from "@/components/characters/line-character";
import { cn } from "@/lib/utils";

export function HeroFigure({
  className,
  duration = 0.7,
  pose = "walk",
  ...props
}: LineCharacterProps) {
  return (
    <div className={cn("relative", className)}>
      <LineCharacter pose={pose} duration={duration} {...props} />
      <span
        aria-hidden="true"
        className="absolute bottom-[4%] left-1/2 h-px w-8 -translate-x-1/2 bg-ink/25"
      />
    </div>
  );
}
