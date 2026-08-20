/**
 * Deterministic creature DNA.
 * The same EGG id always produces the same creature, everywhere in the app —
 * gallery, explorer, nest dashboard — with zero network calls.
 */

import {
  RARITIES,
  TRAIT_CATEGORIES,
  TRAIT_VALUES,
  REWARD_WEIGHT_BASE,
  REWARD_WEIGHT_CAP,
  rarityOf,
  type RarityId,
  type TraitCategory,
} from '@/config/protocol';

/* -------------------------------------------------------------------------- */
/*  PRNG                                                                      */
/* -------------------------------------------------------------------------- */

/** mulberry32 — small, fast, stable across platforms. */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashId(id: number, salt = 0): number {
  let h = (id * 2654435761) ^ (salt * 40503);
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  return h >>> 0;
}

function pick<T>(r: () => number, arr: readonly T[]): T {
  return arr[Math.floor(r() * arr.length) % arr.length];
}

/* -------------------------------------------------------------------------- */
/*  BODY PALETTES                                                             */
/* -------------------------------------------------------------------------- */

export interface BodyPalette {
  name: string;
  base: string;
  light: string;
  dark: string;
  accent: string;
}

export const BODY_PALETTES: readonly BodyPalette[] = [
  { name: 'DOWNY', base: '#fff1c7', light: '#fffaea', dark: '#c9b183', accent: '#f4c95d' },
  { name: 'SPECKLED', base: '#d9c08f', light: '#f2e0b6', dark: '#9c7f52', accent: '#70452a' },
  { name: 'MOSSBACK', base: '#5c8a3d', light: '#7fae54', dark: '#334f22', accent: '#f4c95d' },
  { name: 'CLAY', base: '#a94a38', light: '#c96a52', dark: '#6d2c20', accent: '#f4c95d' },
  { name: 'EMBER', base: '#d98c3f', light: '#f0ae5f', dark: '#8b5220', accent: '#fff1c7' },
  { name: 'FROSTED', base: '#9fb6c4', light: '#cfe0e9', dark: '#5c7280', accent: '#e8f4ff' },
  { name: 'DUSK', base: '#7a6096', light: '#9d82b8', dark: '#4a3660', accent: '#f4c95d' },
  { name: 'IRON', base: '#7f8a7a', light: '#a6b0a0', dark: '#4a5346', accent: '#d98c3f' },
];

export const EYE_COLORS = ['#11130f', '#263a24', '#a94a38', '#2a3a52', '#7a6096'] as const;

/* -------------------------------------------------------------------------- */
/*  DNA                                                                       */
/* -------------------------------------------------------------------------- */

export type Traits = Record<TraitCategory, string>;

export interface CreatureDNA {
  id: number;
  rarity: RarityId;
  palette: BodyPalette;
  eyeColor: string;
  /** 0-5 — silhouette family */
  bodyShape: number;
  eyeStyle: number;
  mouthStyle: number;
  headStyle: number;
  wingStyle: number;
  accessoryStyle: number;
  speckles: boolean;
  glow: boolean;
  extraEye: boolean;
  traits: Traits;
  traitCount: number;
  rewardWeight: number;
}

function rollRarity(r: () => number): RarityId {
  const roll = r() * 100;
  let acc = 0;
  for (const rarity of RARITIES) {
    acc += rarity.share;
    if (roll < acc) return rarity.id;
  }
  return 'COMMON';
}

export interface DnaOverrides {
  rarity?: RarityId;
  generation?: number;
  rewardWeight?: number;
}

export function creatureDNA(id: number, overrides: DnaOverrides = {}): CreatureDNA {
  const r = rng(hashId(id, 7));

  const rarity = overrides.rarity ?? rollRarity(r);
  const palette = pick(r, BODY_PALETTES);
  const eyeColor = pick(r, EYE_COLORS);

  const bodyShape = Math.floor(r() * 4);
  const eyeStyle = Math.floor(r() * 6);
  const mouthStyle = Math.floor(r() * 5);
  const headStyle = Math.floor(r() * 6);
  const wingStyle = Math.floor(r() * 5);
  const accessoryStyle = Math.floor(r() * 5);

  const speckles = r() > 0.55;
  const glow = rarity === 'MYTHIC' || (rarity === 'LEGENDARY' && r() > 0.5);
  const extraEye = rarity === 'MYTHIC' && r() > 0.5;

  const traits = {} as Traits;
  TRAIT_CATEGORIES.forEach((cat) => {
    traits[cat] = pick(r, TRAIT_VALUES[cat]);
  });
  traits.BODY = palette.name;
  if (rarity === 'COMMON') {
    traits.MUTATION = 'NONE';
    traits.SPECIAL = 'NONE';
  }

  const traitCount = TRAIT_CATEGORIES.filter((c) => traits[c] !== 'NONE').length;

  const rewardWeight =
    overrides.rewardWeight ??
    Math.min(
      REWARD_WEIGHT_CAP,
      REWARD_WEIGHT_BASE +
        rarityOf(rarity).bonus +
        (overrides.generation ? Math.round(overrides.generation * (10 + r() * 15)) : 0),
    );

  return {
    id,
    rarity,
    palette,
    eyeColor,
    bodyShape,
    eyeStyle,
    mouthStyle,
    headStyle,
    wingStyle,
    accessoryStyle,
    speckles,
    glow,
    extraEye,
    traits,
    traitCount,
    rewardWeight,
  };
}

/* -------------------------------------------------------------------------- */
/*  EGG SHELL DNA                                                             */
/* -------------------------------------------------------------------------- */

export interface EggDNA {
  id: number;
  shell: string;
  shellLight: string;
  shellDark: string;
  speck: string;
  speckled: boolean;
}

const SHELLS: readonly Omit<EggDNA, 'id' | 'speckled'>[] = [
  { shell: '#fff1c7', shellLight: '#fffcef', shellDark: '#c9b183', speck: '#d9b45e' },
  { shell: '#f4c95d', shellLight: '#ffe49a', shellDark: '#b98f34', speck: '#70452a' },
  { shell: '#e7d3b1', shellLight: '#fdf0d6', shellDark: '#a88c63', speck: '#8a5a33' },
  { shell: '#cfe0e9', shellLight: '#f2fbff', shellDark: '#8ba3b0', speck: '#5c7280' },
];

export function eggDNA(id: number): EggDNA {
  const r = rng(hashId(id, 31));
  const s = SHELLS[Math.floor(r() * SHELLS.length) % SHELLS.length];
  return { id, ...s, speckled: r() > 0.4 };
}
