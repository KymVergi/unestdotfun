/**
 * A tiny pixel-grid engine.
 * Every sprite in UNEST is a grid of palette keys, so the whole site shares one
 * visual DNA: same unit, same outline logic, same shading rules.
 */

export type PaletteKey = string;

export interface Grid {
  w: number;
  h: number;
  /** row-major, '' means transparent */
  cells: PaletteKey[];
}

export type Palette = Record<PaletteKey, string>;

export function makeGrid(w: number, h: number): Grid {
  return { w, h, cells: new Array<PaletteKey>(w * h).fill('') };
}

export function inBounds(g: Grid, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < g.w && y < g.h;
}

export function get(g: Grid, x: number, y: number): PaletteKey {
  if (!inBounds(g, x, y)) return '';
  return g.cells[y * g.w + x];
}

export function set(g: Grid, x: number, y: number, key: PaletteKey): void {
  if (!inBounds(g, x, y)) return;
  g.cells[y * g.w + x] = key;
}

/** Only paints where the grid is currently empty. */
export function setIfEmpty(g: Grid, x: number, y: number, key: PaletteKey): void {
  if (!inBounds(g, x, y)) return;
  if (g.cells[y * g.w + x] === '') g.cells[y * g.w + x] = key;
}

export function rect(g: Grid, x: number, y: number, w: number, h: number, key: PaletteKey): void {
  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) set(g, x + i, y + j, key);
  }
}

export function hLine(g: Grid, x: number, y: number, len: number, key: PaletteKey): void {
  rect(g, x, y, len, 1, key);
}

export function vLine(g: Grid, x: number, y: number, len: number, key: PaletteKey): void {
  rect(g, x, y, 1, len, key);
}

/** Mirrors the left half onto the right half. Keeps sprites perfectly symmetric. */
export function mirrorX(g: Grid): void {
  const half = Math.floor(g.w / 2);
  for (let y = 0; y < g.h; y += 1) {
    for (let x = 0; x < half; x += 1) {
      set(g, g.w - 1 - x, y, get(g, x, y));
    }
  }
}

/** Wraps every non-empty pixel that touches the void with an outline key. */
export function outline(g: Grid, key: PaletteKey, ignore: PaletteKey[] = []): void {
  const src = [...g.cells];
  const solid = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= g.w || y >= g.h) return false;
    const c = src[y * g.w + x];
    return c !== '' && !ignore.includes(c);
  };
  for (let y = 0; y < g.h; y += 1) {
    for (let x = 0; x < g.w; x += 1) {
      if (solid(x, y)) continue;
      if (src[y * g.w + x] !== '') continue;
      if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) {
        set(g, x, y, key);
      }
    }
  }
}

/** Turns "....xx...." style rows into a Grid, padding short rows automatically. */
export function fromRows(rows: string[], empty = '.'): Grid {
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const h = rows.length;
  const g = makeGrid(w, h);
  rows.forEach((row, y) => {
    for (let x = 0; x < w; x += 1) {
      const ch = row[x] ?? empty;
      g.cells[y * w + x] = ch === empty ? '' : ch;
    }
  });
  return g;
}

export interface Run {
  x: number;
  y: number;
  len: number;
  key: PaletteKey;
}

/** Collapses horizontal runs so the SVG stays small. */
export function toRuns(g: Grid): Run[] {
  const runs: Run[] = [];
  for (let y = 0; y < g.h; y += 1) {
    let x = 0;
    while (x < g.w) {
      const key = get(g, x, y);
      if (key === '') {
        x += 1;
        continue;
      }
      let len = 1;
      while (x + len < g.w && get(g, x + len, y) === key) len += 1;
      runs.push({ x, y, len, key });
      x += len;
    }
  }
  return runs;
}
