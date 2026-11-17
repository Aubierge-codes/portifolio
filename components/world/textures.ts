import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Procedural textures for the Work world, drawn once on first use. Nothing is
 * downloaded: every surface here comes from a seeded canvas routine, capped at
 * 1024 px. Colour maps are tagged sRGB; data maps (bump, roughness) stay linear.
 */

type Draw = (
  ctx: CanvasRenderingContext2D,
  size: number,
  rand: () => number
) => void;

/** Small, fast, deterministic PRNG so textures look the same on every visit. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function make(
  size: number,
  seed: number,
  draw: Draw,
  color: boolean,
  repeat = 1
) {
  let texture: CanvasTexture | null = null;
  return () => {
    if (texture || typeof document === "undefined") return texture;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    draw(ctx, size, seeded(seed));
    texture = new CanvasTexture(canvas);
    if (color) texture.colorSpace = SRGBColorSpace;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat, repeat);
    texture.anisotropy = 4;
    return texture;
  };
}

/** Speckle: thousands of soft dots, the base of most of the surfaces below. */
function speckle(
  ctx: CanvasRenderingContext2D,
  size: number,
  rand: () => number,
  count: number,
  radius: number,
  alpha: number,
  light: boolean
) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = light
      ? `rgba(255,255,255,${rand() * alpha})`
      : `rgba(0,0,0,${rand() * alpha})`;
    const r = rand() * radius + 0.3;
    ctx.beginPath();
    ctx.arc(rand() * size, rand() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Woven cloth with soft vertical drape folds. Grey, so it tints by colour. */
export const fabricBump = make(
  512,
  11,
  (ctx, size, rand) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    // Weave: alternating over/under threads.
    for (let y = 0; y < size; y += 4) {
      for (let x = 0; x < size; x += 4) {
        const over = ((x + y) / 4) % 2 === 0;
        ctx.fillStyle = over ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)";
        ctx.fillRect(x, y, 4, 2);
      }
    }
    // Drape: broad, soft folds running down the garment.
    for (let i = 0; i < 9; i++) {
      const x = rand() * size;
      const w = 18 + rand() * 40;
      const g = ctx.createLinearGradient(x - w, 0, x + w, 0);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.5, `rgba(0,0,0,${0.12 + rand() * 0.12})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - w, 0, w * 2, size);
    }
  },
  false,
  3
);

/** Very fine pores and unevenness for skin bump. */
export const skinBump = make(
  256,
  21,
  (ctx, size, rand) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    speckle(ctx, size, rand, 6000, 0.9, 0.18, false);
    speckle(ctx, size, rand, 3000, 0.7, 0.12, true);
  },
  false,
  2
);

/** Fine strand streaks running one way, for hair bump and sheen breakup. */
export const hairBump = make(
  512,
  31,
  (ctx, size, rand) => {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 2600; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const len = 20 + rand() * 80;
      ctx.strokeStyle =
        rand() > 0.5 ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)";
      ctx.lineWidth = 0.6 + rand();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + (rand() - 0.5) * 8,
        y + len / 2,
        x + (rand() - 0.5) * 6,
        y + len
      );
      ctx.stroke();
    }
  },
  false,
  2
);

/** Oak-like planks: colour, grain and a hairline gap between boards. */
export const woodColor = make(
  1024,
  41,
  (ctx, size, rand) => {
    const planks = 6;
    const h = size / planks;
    for (let p = 0; p < planks; p++) {
      const base = 150 + rand() * 30;
      ctx.fillStyle = `rgb(${base}, ${base * 0.74}, ${base * 0.52})`;
      ctx.fillRect(0, p * h, size, h);
      for (let i = 0; i < 70; i++) {
        const y = p * h + rand() * h;
        ctx.strokeStyle = `rgba(70, 40, 20, ${0.05 + rand() * 0.12})`;
        ctx.lineWidth = 0.5 + rand() * 1.6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= size; x += 64) {
          ctx.lineTo(x, y + Math.sin(x / 90 + rand() * 0.6) * 3);
        }
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(40, 24, 12, 0.5)";
      ctx.fillRect(0, p * h, size, 1.5);
      const seam = rand() * size;
      ctx.fillRect(seam, p * h, 1.5, h);
    }
  },
  true,
  2
);

/** Smooth poured concrete with soft cloudy variation and pits. */
export const concreteColor = make(
  512,
  51,
  (ctx, size, rand) => {
    ctx.fillStyle = "#d9d6d0";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 40; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 40 + rand() * 120;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const light = rand() > 0.5;
      g.addColorStop(
        0,
        light ? "rgba(255,255,255,0.12)" : "rgba(90,85,78,0.1)"
      );
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    speckle(ctx, size, rand, 2500, 0.8, 0.2, false);
  },
  true,
  4
);

/** Brushed metal: horizontal streaks for roughness variation. */
export const brushedRoughness = make(
  512,
  61,
  (ctx, size, rand) => {
    ctx.fillStyle = "#6a6a6a";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = `rgba(${rand() > 0.5 ? 255 : 0},${rand() > 0.5 ? 255 : 0},${rand() > 0.5 ? 255 : 0},0.06)`;
      ctx.fillRect(0, rand() * size, size, 0.6 + rand());
    }
  },
  false,
  1
);

/** Rich soil for beds and pots. */
export const soilColor = make(
  256,
  71,
  (ctx, size, rand) => {
    ctx.fillStyle = "#3d2b1f";
    ctx.fillRect(0, 0, size, size);
    speckle(ctx, size, rand, 2500, 1.4, 0.4, false);
    speckle(ctx, size, rand, 900, 1, 0.12, true);
  },
  true,
  2
);

/** Imigongo: Rwandan cow-dung relief art, in black, white and maroon. */
export const imigongo = make(
  1024,
  81,
  (ctx, size) => {
    const cell = size / 8;
    ctx.fillStyle = "#f2efe8";
    ctx.fillRect(0, 0, size, size);
    for (let gy = 0; gy < 8; gy++) {
      for (let gx = 0; gx < 8; gx++) {
        const x = gx * cell;
        const y = gy * cell;
        const dark = (gx + gy) % 2 === 0;
        ctx.fillStyle = dark ? "#151413" : "#f2efe8";
        ctx.fillRect(x, y, cell, cell);
        ctx.strokeStyle = dark
          ? "#f2efe8"
          : (gx + gy) % 4 === 1
            ? "#6e1f24"
            : "#151413";
        ctx.lineWidth = cell * 0.07;
        // Nested chevrons, the signature imigongo figure.
        for (let k = 1; k <= 3; k++) {
          const inset = (k * cell) / 8;
          ctx.beginPath();
          ctx.moveTo(x + inset, y + cell - inset);
          ctx.lineTo(x + cell / 2, y + inset);
          ctx.lineTo(x + cell - inset, y + cell - inset);
          ctx.stroke();
        }
      }
    }
  },
  true,
  1
);

/** Soft round sprite for dust, glows and halos. */
export const softDot = make(
  128,
  91,
  (ctx, size) => {
    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.45)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  },
  true,
  1
);

/** A billowing cloud puff: overlapping soft blobs with a lit top edge. */
export const cloudPuff = make(
  256,
  101,
  (ctx, size, rand) => {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < 26; i++) {
      const x = size * (0.25 + rand() * 0.5);
      const y = size * (0.35 + rand() * 0.35);
      const r = size * (0.12 + rand() * 0.18);
      const g = ctx.createRadialGradient(x, y - r * 0.3, 0, x, y, r);
      g.addColorStop(0, "rgba(255,255,255,0.55)");
      g.addColorStop(0.6, "rgba(236,238,242,0.3)");
      g.addColorStop(1, "rgba(220,224,230,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  true,
  1
);
