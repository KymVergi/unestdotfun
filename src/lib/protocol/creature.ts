/**
 * The single Creature shape used by the entire interface.
 * Demo data and on-chain data both produce exactly this, so no component ever
 * has to know where its data came from.
 */

import { creatureDNA, rng, hashId, type CreatureDNA, type Traits } from '@/lib/pixel/dna';
import {
  MAX_ENERGY,
  REWARD_WEIGHT_CAP,
  SEALED_REVEAL_BLOCKS,
  RARITIES,
  effectiveWeight,
  type RarityId,
} from '@/config/protocol';
import { currentEnergy } from './energy';

export interface Creature {
  id: number;
  /** A Sealed EGG has not been hatched yet — traits stay hidden. */
  isSealed: boolean;
  rarity: RarityId;
  energy: number;
  rewardWeight: number;
  generation: number;
  breedCount: number;
  evolutionCount: number;
  parents: [number, number] | null;
  traits: Traits;
  traitCount: number;
  dna: CreatureDNA;
  /** Blocks left before the reveal target is fixed. Sealed EGGs only. */
  blocksToReveal: number;
  /** Unix seconds. 0 when unknown. */
  lastFedAt: number;
  /** Unix seconds the creature can breed again. 0 when ready. */
  breedReadyAt: number;
}

/* -------------------------------------------------------------------------- */
/*  DEMO / DETERMINISTIC                                                      */
/* -------------------------------------------------------------------------- */

export interface DemoOptions {
  sealed?: boolean;
  generation?: number;
}

/** Builds a plausible creature purely from its id. Used for DEMO DATA. */
export function demoCreature(id: number, opts: DemoOptions = {}): Creature {
  const r = rng(hashId(id, 91));
  const generation = opts.generation ?? (r() > 0.72 ? 1 : 0) + (r() > 0.94 ? 1 : 0);
  const dna = creatureDNA(id, { generation });
  const isSealed = opts.sealed ?? false;

  const energy = isSealed ? MAX_ENERGY : Math.round(r() * MAX_ENERGY);
  const breedCount = generation > 0 || r() > 0.7 ? Math.floor(r() * 3) : 0;
  const evolutionCount = r() > 0.8 ? 1 : 0;

  const rewardWeight = Math.min(REWARD_WEIGHT_CAP, dna.rewardWeight + evolutionCount * 20);

  const parents: [number, number] | null =
    generation > 0 ? [1 + ((id * 7) % 40), 1 + ((id * 13) % 40)] : null;

  return {
    id,
    isSealed,
    rarity: dna.rarity,
    energy,
    rewardWeight,
    generation,
    breedCount,
    evolutionCount,
    parents,
    traits: dna.traits,
    traitCount: dna.traitCount,
    dna,
    blocksToReveal: isSealed ? Math.max(0, SEALED_REVEAL_BLOCKS - Math.floor(r() * 11)) : 0,
    lastFedAt: 0,
    breedReadyAt: 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  ON-CHAIN                                                                  */
/* -------------------------------------------------------------------------- */

/** The struct returned by `creatureOf(tokenId)`. */
export interface ChainCreature {
  sealed_: boolean;
  rarity: number;
  energy: number;
  rewardWeight: number;
  generation: number;
  breedCount: number;
  evolutionCount: number;
  lastFedAt: bigint;
  breedReadyAt: bigint;
}

function rarityFromIndex(index: number): RarityId {
  return RARITIES[Math.max(0, Math.min(RARITIES.length - 1, index))].id;
}

/**
 * Maps a raw contract struct onto the interface's Creature shape.
 *
 * Visual DNA is always derived locally from the token id, so the artwork is
 * identical to what the metadata API serves and needs no extra RPC call. Every
 * *economic* value comes from the chain — nothing is guessed.
 */
export function creatureFromChain(
  id: number,
  raw: ChainCreature,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Creature {
  const generation = Number(raw.generation);
  const rarity = rarityFromIndex(Number(raw.rarity));
  const rewardWeight = Number(raw.rewardWeight);

  // Keep the on-chain rarity and weight; only the looks come from the DNA.
  const dna = creatureDNA(id, { rarity, generation, rewardWeight });

  const lastFedAt = Number(raw.lastFedAt);
  const isSealed = Boolean(raw.sealed_);

  return {
    id,
    isSealed,
    rarity,
    energy: isSealed ? MAX_ENERGY : currentEnergy(Number(raw.energy), lastFedAt, nowSeconds),
    rewardWeight,
    generation,
    breedCount: Number(raw.breedCount),
    evolutionCount: Number(raw.evolutionCount),
    parents: null,
    traits: dna.traits,
    traitCount: dna.traitCount,
    dna,
    blocksToReveal: 0,
    lastFedAt,
    breedReadyAt: Number(raw.breedReadyAt),
  };
}

/* -------------------------------------------------------------------------- */
/*  AGGREGATES                                                                */
/* -------------------------------------------------------------------------- */

export interface NestTotals {
  supportedEggs: number;
  active: number;
  hibernating: number;
  sealed: number;
  totalWeight: number;
  totalEffectiveWeight: number;
}

export function nestTotals(creatures: Creature[]): NestTotals {
  return creatures.reduce<NestTotals>(
    (acc, c) => {
      acc.supportedEggs += 1;
      if (c.isSealed) acc.sealed += 1;
      else if (c.energy <= 0) acc.hibernating += 1;
      else acc.active += 1;
      acc.totalWeight += c.rewardWeight;
      if (!c.isSealed) acc.totalEffectiveWeight += effectiveWeight(c.rewardWeight, c.energy);
      return acc;
    },
    {
      supportedEggs: 0,
      active: 0,
      hibernating: 0,
      sealed: 0,
      totalWeight: 0,
      totalEffectiveWeight: 0,
    },
  );
}

/** Creatures that can act as a breeding partner for `self`. */
export function eligiblePartners(
  creatures: Creature[],
  self: Creature,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Creature[] {
  return creatures.filter(
    (c) => c.id !== self.id && !c.isSealed && c.energy > 0 && c.breedReadyAt <= nowSeconds,
  );
}
