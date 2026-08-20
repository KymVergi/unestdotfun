import { makeGrid, set, get, rect, outline, type Grid } from './grid';
import { creatureDNA, type CreatureDNA } from './dna';

export const CREATURE_W = 18;
export const CREATURE_H = 18;

export interface CreatureBuild {
  grid: Grid;
  palette: Record<string, string>;
  dna: CreatureDNA;
  /** Coordinates of eye pixels so the renderer can blink them. */
  eyes: { x: number; y: number }[];
}

interface Shape {
  rx: number;
  ry: number;
  cy: number;
}

const SHAPES: Shape[] = [
  { rx: 5.4, ry: 4.8, cy: 10.2 }, // round
  { rx: 4.6, ry: 5.6, cy: 9.8 }, // tall
  { rx: 6.0, ry: 4.2, cy: 10.6 }, // wide
  { rx: 5.0, ry: 5.0, cy: 10.0 }, // balanced
];

/**
 * Builds a 18x18 pixel creature from its DNA.
 * The silhouette is generated mathematically and mirrored, so every creature is
 * symmetric and unmistakably part of the same species family.
 */
export function buildCreature(id: number, dnaOverride?: CreatureDNA): CreatureBuild {
  const dna = dnaOverride ?? creatureDNA(id);
  const g = makeGrid(CREATURE_W, CREATURE_H);
  const cx = CREATURE_W / 2;
  const shape = SHAPES[dna.bodyShape % SHAPES.length];
  const pearShift = dna.bodyShape === 3 ? 0.9 : 0;

  /* ---- body ------------------------------------------------------------ */
  for (let y = 0; y < CREATURE_H; y += 1) {
    const dy = (y + 0.5 - shape.cy) / shape.ry;
    if (Math.abs(dy) > 1) continue;
    const widen = 1 + pearShift * Math.max(0, dy) * 0.35;
    const rx = shape.rx * Math.sqrt(Math.max(0, 1 - dy * dy)) * widen;
    for (let x = 0; x < CREATURE_W; x += 1) {
      const nx = (x + 0.5 - cx) / rx;
      if (Math.abs(nx) > 1) continue;
      let key = 'b';
      if (nx < -0.4 && dy < 0.1) key = 'l';
      else if (nx > 0.42 || dy > 0.62) key = 'd';
      set(g, x, y, key);
    }
  }

  /* ---- speckles -------------------------------------------------------- */
  if (dna.speckles) {
    for (let i = 0; i < 7; i += 1) {
      const x = 4 + ((i * 5 + dna.id) % (CREATURE_W - 8));
      const y = 8 + ((i * 3 + dna.id) % 5);
      if (get(g, x, y) !== '') set(g, x, y, 'a');
    }
  }

  /* ---- wings ----------------------------------------------------------- */
  if (dna.wingStyle > 0) {
    const wy = 9;
    const len = dna.wingStyle === 4 ? 3 : 2;
    for (let i = 0; i < len; i += 1) {
      set(g, 1 + i, wy + i, dna.wingStyle === 3 ? 'd' : 'w');
      set(g, CREATURE_W - 2 - i, wy + i, dna.wingStyle === 3 ? 'd' : 'w');
    }
    if (dna.wingStyle >= 2) {
      set(g, 1, wy + 1, 'w');
      set(g, CREATURE_W - 2, wy + 1, 'w');
    }
  }

  /* ---- head decoration ------------------------------------------------- */
  const topY = Math.max(0, Math.round(shape.cy - shape.ry));
  switch (dna.headStyle) {
    case 0: // tuft
      set(g, Math.round(cx) - 1, topY - 1, 'a');
      set(g, Math.round(cx), topY - 2, 'a');
      break;
    case 1: // straw hat
      rect(g, Math.round(cx) - 4, topY - 1, 8, 1, 'h');
      rect(g, Math.round(cx) - 2, topY - 3, 4, 2, 'h');
      break;
    case 2: // horns
      set(g, Math.round(cx) - 3, topY - 1, 'h');
      set(g, Math.round(cx) - 4, topY - 2, 'h');
      set(g, Math.round(cx) + 2, topY - 1, 'h');
      set(g, Math.round(cx) + 3, topY - 2, 'h');
      break;
    case 3: // crown
      rect(g, Math.round(cx) - 3, topY - 1, 6, 1, 'g');
      set(g, Math.round(cx) - 3, topY - 2, 'g');
      set(g, Math.round(cx), topY - 3, 'g');
      set(g, Math.round(cx) + 2, topY - 2, 'g');
      break;
    case 4: // antenna
      set(g, Math.round(cx), topY - 1, 'h');
      set(g, Math.round(cx), topY - 2, 'h');
      set(g, Math.round(cx), topY - 3, 'g');
      break;
    default:
      break;
  }

  /* ---- eyes ------------------------------------------------------------ */
  const eyeY = Math.round(shape.cy - 1);
  const eyes: { x: number; y: number }[] = [];
  const eyeOffsets = [-3, 2];
  eyeOffsets.forEach((off) => {
    const ex = Math.round(cx) + off;
    switch (dna.eyeStyle) {
      case 1: // sleepy — a single dark line
        set(g, ex, eyeY, 'e');
        set(g, ex + 1, eyeY, 'e');
        break;
      case 2: // wide
        rect(g, ex, eyeY - 1, 2, 2, 'q');
        set(g, ex + (off < 0 ? 1 : 0), eyeY, 'e');
        break;
      case 3: // glint
        set(g, ex, eyeY, 'e');
        set(g, ex + 1, eyeY - 1, 'q');
        break;
      case 4: // void
        rect(g, ex, eyeY - 1, 2, 2, 'e');
        break;
      case 5: // double
        set(g, ex, eyeY, 'e');
        set(g, ex + 1, eyeY + 1, 'e');
        break;
      default: // dot
        set(g, ex, eyeY, 'e');
        break;
    }
    eyes.push({ x: ex, y: eyeY });
  });

  if (dna.extraEye) {
    set(g, Math.round(cx) - 1, eyeY - 3, 'e');
    eyes.push({ x: Math.round(cx) - 1, y: eyeY - 3 });
  }

  /* ---- mouth / beak ---------------------------------------------------- */
  const mouthY = eyeY + 2;
  switch (dna.mouthStyle) {
    case 1: // grin
      rect(g, Math.round(cx) - 2, mouthY, 4, 1, 'e');
      break;
    case 2: // whistle
      set(g, Math.round(cx) - 1, mouthY, 'e');
      break;
    case 3: // chomp
      rect(g, Math.round(cx) - 2, mouthY, 4, 2, 'e');
      set(g, Math.round(cx) - 1, mouthY, 'l');
      break;
    case 4: // seed
      set(g, Math.round(cx) - 1, mouthY, 'g');
      set(g, Math.round(cx), mouthY, 'g');
      break;
    default: // beak
      rect(g, Math.round(cx) - 2, mouthY, 4, 1, 'g');
      rect(g, Math.round(cx) - 1, mouthY + 1, 2, 1, 'g');
      break;
  }

  /* ---- feet ------------------------------------------------------------ */
  const footY = Math.min(CREATURE_H - 1, Math.round(shape.cy + shape.ry));
  rect(g, Math.round(cx) - 4, footY, 2, 1, 'g');
  rect(g, Math.round(cx) + 2, footY, 2, 1, 'g');

  /* ---- accessory (asymmetric on purpose) ------------------------------- */
  switch (dna.accessoryStyle) {
    case 1: // bell
      set(g, Math.round(cx) + 3, mouthY + 2, 'g');
      break;
    case 2: // scarf
      rect(g, Math.round(cx) - 4, mouthY + 2, 8, 1, 'r');
      set(g, Math.round(cx) + 3, mouthY + 3, 'r');
      break;
    case 3: // lantern
      set(g, CREATURE_W - 2, mouthY + 1, 'g');
      set(g, CREATURE_W - 2, mouthY + 2, 'g');
      break;
    case 4: // tool belt
      rect(g, Math.round(cx) - 4, footY - 2, 8, 1, 'w');
      break;
    default:
      break;
  }

  outline(g, 'o');

  const p = dna.palette;
  const palette: Record<string, string> = {
    o: '#11130f',
    b: p.base,
    l: p.light,
    d: p.dark,
    a: p.accent,
    e: dna.eyeColor,
    q: '#fffaea',
    g: '#f4c95d',
    h: '#70452a',
    w: p.dark,
    r: '#a94a38',
  };

  return { grid: g, palette, dna, eyes };
}
