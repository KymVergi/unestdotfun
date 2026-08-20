/**
 * UNEST — PROTOCOL CONSTANTS
 * ---------------------------------------------------------------------------
 * Single source of truth for every economic value in the interface.
 * Never hardcode these numbers inside components.
 *
 *   $UNEST = TOKEN      (ERC-20, the fuel)
 *   EGG    = NFT        (ERC-721, the creature)
 *   NEST   = ECONOMY
 *   FARM   = WORLD
 *   HOOK   = ENGINE
 */

/* -------------------------------------------------------------------------- */
/*  $UNEST — THE TOKEN                                                        */
/* -------------------------------------------------------------------------- */

export const UNEST_SYMBOL = '$UNEST' as const;
export const UNEST_NAME = 'UNEST' as const;
export const UNEST_STANDARD = 'ERC-20' as const;
export const UNEST_DECIMALS = 18 as const;

/** 100,000,000,000 $UNEST */
export const UNEST_SUPPLY = 100_000_000_000;

/* -------------------------------------------------------------------------- */
/*  EGG — THE NFT                                                             */
/* -------------------------------------------------------------------------- */

export const EGG_SYMBOL = 'EGG' as const;
export const EGG_STANDARD = 'ERC-721' as const;

/** A complete unit of qualifying purchase that creates 1 SEALED EGG. */
export const MINT_UNIT = 50_000_000;

/** UNEST_SUPPLY / MINT_UNIT — a ceiling, not a fixed supply. */
export const THEORETICAL_MAX_EGGS = UNEST_SUPPLY / MINT_UNIT; // 2,000

/** Blocks after mint before the reveal target becomes fixed. */
export const SEALED_REVEAL_BLOCKS = 10;

/* -------------------------------------------------------------------------- */
/*  HATCHING                                                                  */
/* -------------------------------------------------------------------------- */

export const HATCH_COST = 2_500_000;
export const HATCH_TRAIT_MIN = 6;
export const HATCH_TRAIT_MAX = 7;

/* -------------------------------------------------------------------------- */
/*  ENERGY                                                                    */
/* -------------------------------------------------------------------------- */

export const MAX_ENERGY = 100;
export const START_ENERGY = 100;
/** Energy lost per ~24 hours. */
export const ENERGY_DECAY = 10;
export const ENERGY_DECAY_PERIOD_HOURS = 24;
export const FEED_COST = 500_000;
export const FEED_AMOUNT = 50;
export const HIBERNATION_ENERGY = 0;

export type EnergyStateId = 'happy' | 'active' | 'hungry' | 'weak' | 'hibernating';

export interface EnergyState {
  id: EnergyStateId;
  label: string;
  threshold: number;
  color: string;
  note: string;
}

/** Ordered high → low. Use `energyState()` to resolve. */
export const ENERGY_STATES: readonly EnergyState[] = [
  {
    id: 'happy',
    label: 'HAPPY',
    threshold: 100,
    color: 'var(--ok)',
    note: 'Full effective weight.',
  },
  {
    id: 'active',
    label: 'ACTIVE',
    threshold: 75,
    color: 'var(--color-green-light)',
    note: 'Producing normally.',
  },
  {
    id: 'hungry',
    label: 'HUNGRY',
    threshold: 50,
    color: 'var(--color-yolk)',
    note: 'Effective weight halved.',
  },
  {
    id: 'weak',
    label: 'WEAK',
    threshold: 25,
    color: 'var(--color-accent)',
    note: 'Close to hibernation.',
  },
  {
    id: 'hibernating',
    label: 'HIBERNATING',
    threshold: 0,
    color: 'var(--danger)',
    note: 'Generates no rewards until fed.',
  },
] as const;

/**
 * Resolves the label for a given Energy: the highest threshold the creature
 * still meets. Driven by ENERGY_STATES so the ladder is defined in one place.
 *
 *   100      HAPPY
 *   75–99    ACTIVE
 *   50–74    HUNGRY
 *   1–49     WEAK
 *   0        HIBERNATING
 */
export function energyState(energy: number): EnergyState {
  const clamped = Math.max(0, Math.min(MAX_ENERGY, energy));
  const hibernating = ENERGY_STATES[ENERGY_STATES.length - 1];
  const weak = ENERGY_STATES[ENERGY_STATES.length - 2];

  if (clamped <= 0) return hibernating;

  for (const state of ENERGY_STATES) {
    if (state.threshold > 0 && clamped >= state.threshold) return state;
  }
  return weak;
}

/* -------------------------------------------------------------------------- */
/*  BREEDING                                                                  */
/* -------------------------------------------------------------------------- */

export const BREED_COST = 5_000_000;
/** Days. */
export const BREED_COOLDOWN = 3;
export const BREED_WEIGHT_BONUS_MIN = 10;
export const BREED_WEIGHT_BONUS_MAX = 25;
/** Each parent, from the child's rewards. */
export const BREED_PARENT_ROYALTY_PCT = 5;
export const BREED_ROYALTY_DAYS = 30;

/* -------------------------------------------------------------------------- */
/*  EVOLUTION                                                                 */
/* -------------------------------------------------------------------------- */

export const EVOLUTION_COST = 10_000_000;
export const EVOLUTION_MIN_ENERGY = 75;
export const EVOLUTION_SUCCESS_RATE = 70;
export const EVOLUTION_FAIL_RATE = 100 - EVOLUTION_SUCCESS_RATE;

/* -------------------------------------------------------------------------- */
/*  BACKING                                                                   */
/* -------------------------------------------------------------------------- */

/** Wallet backing required per EGG. NOT locked — it stays liquid. */
export const BACKING_PER_EGG = MINT_UNIT;

export function supportedEggs(unestBalance: number): number {
  return Math.floor(unestBalance / BACKING_PER_EGG);
}

/* -------------------------------------------------------------------------- */
/*  REWARDS                                                                   */
/* -------------------------------------------------------------------------- */

export interface RewardSlice {
  id: string;
  label: string;
  pct: number;
  color: string;
  description: string;
}

/** Recommended pool fee distribution. 90 / 5 / 3 / 2. */
export const REWARD_DISTRIBUTION: readonly RewardSlice[] = [
  {
    id: 'creatures',
    label: 'ACTIVE CREATURES',
    pct: 90,
    color: 'var(--color-yolk)',
    description: 'Split by Effective Reward Weight across every non-hibernating creature.',
  },
  {
    id: 'nest',
    label: 'NEST POOL',
    pct: 5,
    color: 'var(--color-farm-green)',
    description: 'Shared reserve held by the Nest for protocol-level operations.',
  },
  {
    id: 'buyback',
    label: 'BUYBACK & BURN',
    pct: 3,
    color: 'var(--color-barn)',
    description: 'Buys $UNEST from the official pool and burns it.',
  },
  {
    id: 'treasury',
    label: 'TREASURY',
    pct: 2,
    color: 'var(--color-accent)',
    description: 'Development, infrastructure and maintenance of the Farm.',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  REWARD WEIGHT                                                             */
/* -------------------------------------------------------------------------- */

export const REWARD_WEIGHT_BASE = 100;
export const REWARD_WEIGHT_CAP = 400;

export type RarityId = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'MYTHIC';

export interface Rarity {
  id: RarityId;
  label: string;
  bonus: number;
  color: string;
  /** Indicative share of the population, for the explorer UI only. */
  share: number;
}

export const RARITIES: readonly Rarity[] = [
  { id: 'COMMON', label: 'COMMON', bonus: 0, color: 'var(--rarity-common)', share: 55 },
  { id: 'UNCOMMON', label: 'UNCOMMON', bonus: 10, color: 'var(--rarity-uncommon)', share: 25 },
  { id: 'RARE', label: 'RARE', bonus: 30, color: 'var(--rarity-rare)', share: 13 },
  { id: 'LEGENDARY', label: 'LEGENDARY', bonus: 75, color: 'var(--rarity-legendary)', share: 6 },
  { id: 'MYTHIC', label: 'MYTHIC', bonus: 150, color: 'var(--rarity-mythic)', share: 1 },
] as const;

export function rarityOf(id: RarityId): Rarity {
  return RARITIES.find((r) => r.id === id) ?? RARITIES[0];
}

/** Effective Weight = Reward Weight × Energy % */
export function effectiveWeight(rewardWeight: number, energy: number): number {
  return Math.round(rewardWeight * (Math.max(0, Math.min(MAX_ENERGY, energy)) / MAX_ENERGY));
}

/* -------------------------------------------------------------------------- */
/*  TOKEN SINKS                                                               */
/* -------------------------------------------------------------------------- */

export interface TokenSink {
  id: string;
  label: string;
  amount: string;
  detail: string;
  burns: boolean;
}

export const TOKEN_SINKS: readonly TokenSink[] = [
  {
    id: 'hatch',
    label: 'HATCH',
    amount: '2.5M $UNEST',
    detail: 'Opens a Sealed EGG.',
    burns: true,
  },
  {
    id: 'feed',
    label: 'FEED',
    amount: '500K $UNEST',
    detail: '+50 Energy, capped at 100.',
    burns: true,
  },
  {
    id: 'breed',
    label: 'BREED',
    amount: '5M $UNEST',
    detail: 'Creates a new Sealed EGG.',
    burns: true,
  },
  {
    id: 'evolve',
    label: 'EVOLUTION',
    amount: '10M $UNEST',
    detail: '70% upgrade / 30% no change.',
    burns: true,
  },
  {
    id: 'buyback',
    label: 'BUYBACK',
    amount: '3% of fees',
    detail: 'Protocol buys and burns $UNEST.',
    burns: true,
  },
  {
    id: 'backing',
    label: 'UNDER-BACKING',
    amount: 'EGG BURN',
    detail: 'Unsupported EGGs are burned.',
    burns: true,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  TRAITS                                                                    */
/* -------------------------------------------------------------------------- */

export const TRAIT_CATEGORIES = [
  'BACKGROUND',
  'BODY',
  'EYES',
  'MOUTH',
  'HEAD',
  'ACCESSORY',
  'WINGS',
  'SPECIAL',
  'MUTATION',
] as const;

export type TraitCategory = (typeof TRAIT_CATEGORIES)[number];

export const TRAIT_VALUES: Record<TraitCategory, readonly string[]> = {
  BACKGROUND: ['DAWN FIELD', 'HAY LOFT', 'MOONLIT COOP', 'STORM FENCE', 'GOLDEN HARVEST'],
  BODY: ['DOWNY', 'SPECKLED', 'MOSSBACK', 'CLAY', 'EMBER', 'FROSTED'],
  EYES: ['DOT', 'SLEEPY', 'WIDE', 'GLINT', 'VOID', 'DOUBLE'],
  MOUTH: ['BEAK', 'GRIN', 'WHISTLE', 'CHOMP', 'SEED'],
  HEAD: ['TUFT', 'STRAW HAT', 'HORNS', 'CROWN', 'ANTENNA', 'NONE'],
  ACCESSORY: ['BELL', 'SCARF', 'LANTERN', 'TOOL BELT', 'NONE'],
  WINGS: ['STUB', 'FEATHERED', 'LEATHER', 'CRYSTAL', 'NONE'],
  SPECIAL: ['NONE', 'GOLDEN SHELL', 'GLOW', 'IRON YOLK', 'ANCIENT'],
  MUTATION: ['NONE', 'SPLIT TAIL', 'EXTRA EYE', 'INVERTED', 'PRISM'],
};

/* -------------------------------------------------------------------------- */
/*  THE LOOP                                                                  */
/* -------------------------------------------------------------------------- */

export const LOOP_STEPS = [
  'BUY $UNEST',
  'SEALED EGG',
  'HATCH',
  'CREATURE',
  'FEED',
  'REWARDS',
  'BREED',
  'EVOLVE',
  'BURN',
  'SCARCITY',
] as const;

/* -------------------------------------------------------------------------- */
/*  COPY                                                                      */
/* -------------------------------------------------------------------------- */

export const SLOGAN_PRIMARY = 'FEED THE NEST.';
export const SLOGAN_ALT_1 = '$UNEST IS THE FUEL. EGG IS THE LIFE.';
export const SLOGAN_ALT_2 = 'BUY. HATCH. FEED. BREED.';
export const SLOGAN_ALT_3 = 'A LIVING ECONOMY, ONE EGG AT A TIME.';

export const HERO_HEADLINE = 'UNEST';
export const HERO_SUBHEADLINE = 'THE FUEL FOR A LIVING ON-CHAIN ECONOMY.';
export const HERO_SUPPORT = '$UNEST powers a new generation of on-chain creatures.';

/* -------------------------------------------------------------------------- */
/*  FORMATTED HELPERS FOR DISPLAY                                             */
/* -------------------------------------------------------------------------- */

export const PROTOCOL_STATS = {
  supply: { value: '100B', label: '$UNEST SUPPLY' },
  mintUnit: { value: '50M', label: 'MINT UNIT' },
  eggs: { value: '2,000', label: 'THEORETICAL EGGS' },
} as const;
