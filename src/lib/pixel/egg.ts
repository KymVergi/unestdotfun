import { makeGrid, set, get, outline, type Grid } from './grid';
import { eggDNA, rng, type EggDNA } from './dna';

export const EGG_W = 16;
export const EGG_H = 20;

export interface EggOptions {
  /** Token id — drives shell colour and speckles. */
  id?: number;
  /** 0 = pristine, 1 = hairline, 2 = fractured, 3 = about to open. */
  crack?: 0 | 1 | 2 | 3;
  /** Removes the crown of the shell, for the hatch moment. */
  open?: boolean;
  /** Golden variant used for the hero and rare states. */
  golden?: boolean;
}

export const EGG_PALETTE_KEYS = {
  outline: 'o',
  base: 'b',
  light: 'l',
  dark: 'd',
  speck: 's',
  crack: 'c',
} as const;

export function eggPalette(dna: EggDNA, golden = false) {
  if (golden) {
    return {
      o: '#4b2d1b',
      b: '#f4c95d',
      l: '#ffeaa8',
      d: '#b98f34',
      s: '#8b5f1c',
      c: '#4b2d1b',
    };
  }
  return {
    o: '#4b2d1b',
    b: dna.shell,
    l: dna.shellLight,
    d: dna.shellDark,
    s: dna.speck,
    c: '#4b2d1b',
  };
}

/** Half width of the shell at a given row. */
function shellRadius(y: number, h: number, w: number): number {
  const cy = h * 0.58;
  const span = y + 0.5 < cy ? cy : h - cy;
  const t = (y + 0.5 - cy) / span;
  const round = Math.sqrt(Math.max(0, 1 - t * t));
  const narrow = y + 0.5 < cy ? 0.78 + 0.22 * ((y + 0.5) / cy) : 1;
  return (w / 2 - 0.5) * round * narrow;
}

export function buildEgg(opts: EggOptions = {}): { grid: Grid; palette: Record<string, string> } {
  const { id = 1, crack = 0, open = false, golden = false } = opts;
  const dna = eggDNA(id);
  const g = makeGrid(EGG_W, EGG_H);
  const cx = EGG_W / 2;

  for (let y = 0; y < EGG_H; y += 1) {
    const rx = shellRadius(y, EGG_H, EGG_W);
    if (rx <= 0) continue;
    for (let x = 0; x < EGG_W; x += 1) {
      const nx = (x + 0.5 - cx) / rx;
      if (Math.abs(nx) > 1) continue;
      const v = (y + 0.5) / EGG_H;
      let key: string = 'b';
      if (nx < -0.34 && v < 0.6) key = 'l';
      else if (nx > 0.3 || v > 0.86) key = 'd';
      set(g, x, y, key);
    }
  }

  // Speckles — stable per id.
  if (dna.speckled) {
    const r = rng(dna.id * 977 + 13);
    for (let i = 0; i < 14; i += 1) {
      const y = 4 + Math.floor(r() * (EGG_H - 7));
      const rx = shellRadius(y, EGG_H, EGG_W);
      const x = Math.round(cx + (r() * 2 - 1) * rx * 0.72 - 0.5);
      if (get(g, x, y) !== '') set(g, x, y, 's');
    }
  }

  // Cracks — a deterministic zig-zag walking down the shell.
  if (crack > 0) {
    const steps = crack === 1 ? 4 : crack === 2 ? 8 : 12;
    let x = Math.round(cx) - 1;
    let y = Math.round(EGG_H * 0.34);
    const r = rng(dna.id * 31 + crack);
    for (let i = 0; i < steps; i += 1) {
      if (get(g, x, y) !== '') set(g, x, y, 'c');
      y += 1;
      x += r() > 0.5 ? 1 : -1;
      if (get(g, x, y) !== '') set(g, x, y, 'c');
    }
    if (crack >= 2) {
      let bx = Math.round(cx) + 1;
      let by = Math.round(EGG_H * 0.4);
      for (let i = 0; i < steps - 2; i += 1) {
        if (get(g, bx, by) !== '') set(g, bx, by, 'c');
        bx += r() > 0.45 ? 1 : -1;
        by += i % 2 === 0 ? 1 : 0;
      }
    }
  }

  // Hatch moment — the crown of the shell is gone.
  if (open) {
    const cut = Math.round(EGG_H * 0.36);
    const r = rng(dna.id * 7 + 3);
    for (let x = 0; x < EGG_W; x += 1) {
      const edge = cut + (r() > 0.5 ? 1 : 0);
      for (let y = 0; y < edge; y += 1) set(g, x, y, '');
    }
  }

  outline(g, 'o');
  return { grid: g, palette: eggPalette(dna, golden) };
}
