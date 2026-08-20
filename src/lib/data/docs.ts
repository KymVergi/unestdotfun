import {
  BACKING_PER_EGG,
  BREED_COOLDOWN,
  BREED_COST,
  BREED_PARENT_ROYALTY_PCT,
  BREED_ROYALTY_DAYS,
  BREED_WEIGHT_BONUS_MAX,
  BREED_WEIGHT_BONUS_MIN,
  ENERGY_DECAY,
  ENERGY_DECAY_PERIOD_HOURS,
  EVOLUTION_COST,
  EVOLUTION_FAIL_RATE,
  EVOLUTION_MIN_ENERGY,
  EVOLUTION_SUCCESS_RATE,
  FEED_AMOUNT,
  FEED_COST,
  HATCH_COST,
  HATCH_TRAIT_MAX,
  HATCH_TRAIT_MIN,
  MAX_ENERGY,
  MINT_UNIT,
  REWARD_WEIGHT_BASE,
  REWARD_WEIGHT_CAP,
  SEALED_REVEAL_BLOCKS,
  THEORETICAL_MAX_EGGS,
  UNEST_DECIMALS,
  UNEST_SUPPLY,
} from '@/config/protocol';
import { compact, grouped } from '@/lib/utils/format';

export interface DocBlock {
  kind: 'p' | 'list' | 'code' | 'note' | 'warn';
  text?: string;
  items?: string[];
}

export interface DocSection {
  id: string;
  index: string;
  title: string;
  blocks: DocBlock[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    index: '01',
    title: 'OVERVIEW',
    blocks: [
      {
        kind: 'p',
        text: 'UNEST is an on-chain creature economy on Ethereum mainnet. It has exactly two assets and one engine.',
      },
      {
        kind: 'list',
        items: [
          '$UNEST — the ERC-20 token. The fuel.',
          'EGG — the ERC-721 NFT. The creature.',
          'THE NEST — the economy the creatures live in.',
          'THE FARM — the world you are looking at.',
          'UNISWAP V4 HOOKS — the engine that enforces all of it.',
        ],
      },
      {
        kind: 'p',
        text: 'The loop: buy $UNEST from the official pool, receive a Sealed EGG, hatch it into a creature, feed it to keep it awake, earn a share of pool fees, breed and evolve, and burn fuel at every step.',
      },
      {
        kind: 'note',
        text: 'Terminology is strict throughout this documentation. $UNEST is never called the NFT. EGG is never called the token.',
      },
    ],
  },
  {
    id: 'unest',
    index: '02',
    title: '$UNEST',
    blocks: [
      { kind: 'p', text: '$UNEST is an ERC-20 token deployed on Ethereum mainnet.' },
      {
        kind: 'list',
        items: [
          `Total supply: ${grouped(UNEST_SUPPLY)}`,
          `Decimals: ${UNEST_DECIMALS}`,
          'Role: the fuel for every action on the Farm',
          'Consumed by: hatching, feeding, breeding, evolution and buyback',
        ],
      },
      {
        kind: 'p',
        text: '$UNEST is a normal transferable token. Holding it is not staking. Using it in the protocol is always an explicit action you sign.',
      },
    ],
  },
  {
    id: 'egg',
    index: '03',
    title: 'EGG',
    blocks: [
      {
        kind: 'p',
        text: 'EGG is an ERC-721 NFT. Every EGG begins sealed and becomes a permanent creature when hatched.',
      },
      {
        kind: 'list',
        items: [
          `Theoretical maximum: ${grouped(THEORETICAL_MAX_EGGS)}`,
          `Mint unit: ${compact(MINT_UNIT)} $UNEST of qualifying purchase`,
          `Backing requirement: ${compact(BACKING_PER_EGG)} $UNEST held in the wallet`,
          'Two lifecycle states: SEALED and HATCHED',
        ],
      },
      {
        kind: 'warn',
        text: `${grouped(THEORETICAL_MAX_EGGS)} is a ceiling derived from token math, not a fixed NFT supply. The real number can only be lower.`,
      },
    ],
  },
  {
    id: 'minting',
    index: '04',
    title: 'MINTING',
    blocks: [
      {
        kind: 'p',
        text: `A qualifying purchase from the official ETH/$UNEST Uniswap v4 pool creates Sealed EGGs. Every complete ${compact(MINT_UNIT)} $UNEST purchased from that pool produces one Sealed EGG.`,
      },
      { kind: 'code', text: `${compact(MINT_UNIT)} $UNEST purchased  →  1 SEALED EGG` },
      {
        kind: 'list',
        items: [
          'Normal transfers do not mint EGGs.',
          'Receiving $UNEST does not mint EGGs.',
          `Accumulating ${compact(MINT_UNIT)} through transfers does not mint EGGs.`,
          'Buying from a different pool does not mint EGGs.',
        ],
      },
      {
        kind: 'note',
        text: `The ${compact(MINT_UNIT)} $UNEST is not locked. It remains liquid in your wallet.`,
      },
    ],
  },
  {
    id: 'sealed-eggs',
    index: '05',
    title: 'SEALED EGGS',
    blocks: [
      {
        kind: 'p',
        text: `Every newly created NFT begins as a Sealed EGG with its traits hidden. After approximately ${SEALED_REVEAL_BLOCKS} blocks the reveal target becomes fixed.`,
      },
      {
        kind: 'p',
        text: 'A Sealed EGG is a full NFT: it can be held and transferred like any other. It simply has no creature inside it yet.',
      },
    ],
  },
  {
    id: 'hatching',
    index: '06',
    title: 'HATCHING',
    blocks: [
      {
        kind: 'p',
        text: `Hatching burns ${compact(HATCH_COST)} $UNEST and turns the Sealed EGG into a permanent creature.`,
      },
      {
        kind: 'list',
        items: [
          `Generates ${HATCH_TRAIT_MIN}–${HATCH_TRAIT_MAX} permanent traits`,
          'Sets Rarity',
          'Sets Reward Weight',
          'Sets Visual DNA',
        ],
      },
      { kind: 'warn', text: 'Hatching cannot be undone. Traits are written once.' },
    ],
  },
  {
    id: 'energy',
    index: '07',
    title: 'ENERGY',
    blocks: [
      {
        kind: 'p',
        text: `Every creature has Energy from 0 to ${MAX_ENERGY}. It starts at ${MAX_ENERGY} on hatch and decays by ${ENERGY_DECAY} every approximately ${ENERGY_DECAY_PERIOD_HOURS} hours.`,
      },
      {
        kind: 'list',
        items: ['100 — HAPPY', '75 — ACTIVE', '50 — HUNGRY', '25 — WEAK', '0 — HIBERNATING'],
      },
      {
        kind: 'p',
        text: `Feeding costs ${compact(FEED_COST)} $UNEST and restores +${FEED_AMOUNT} Energy, capped at ${MAX_ENERGY}.`,
      },
      {
        kind: 'warn',
        text: 'A creature at 0 Energy is hibernating and generates no rewards until it is fed. It is not burned and it is not lost.',
      },
    ],
  },
  {
    id: 'rewards',
    index: '08',
    title: 'REWARDS',
    blocks: [
      { kind: 'p', text: 'Recommended pool fee distribution:' },
      {
        kind: 'list',
        items: ['90% — ACTIVE CREATURES', '5% — NEST POOL', '3% — BUYBACK & BURN', '2% — TREASURY'],
      },
      { kind: 'code', text: 'Effective Weight = Reward Weight × Energy %' },
      {
        kind: 'p',
        text: 'A creature with Reward Weight 300 at 100% Energy has an Effective Weight of 300. The same creature at 25% Energy has an Effective Weight of 75. Rewards are distributed in proportion to Effective Weight across all active creatures.',
      },
      {
        kind: 'warn',
        text: 'No return is promised or guaranteed. Distribution depends entirely on pool activity. No APR is published anywhere on this site.',
      },
    ],
  },
  {
    id: 'breeding',
    index: '09',
    title: 'BREEDING',
    blocks: [
      { kind: 'p', text: 'Two active creatures can produce a new Sealed EGG.' },
      {
        kind: 'list',
        items: [
          'Both parents must have Energy above 0',
          `Cost: ${compact(BREED_COST)} $UNEST, burned`,
          `Cooldown: ${BREED_COOLDOWN} days`,
          'Result: a new Sealed EGG',
        ],
      },
      {
        kind: 'p',
        text: `The child inherits traits from both parents, can receive mutations, gains +${BREED_WEIGHT_BONUS_MIN}–${BREED_WEIGHT_BONUS_MAX} Reward Weight and receives a generation number.`,
      },
      {
        kind: 'note',
        text: `Each parent receives ${BREED_PARENT_ROYALTY_PCT}% of the child's rewards for ${BREED_ROYALTY_DAYS} days.`,
      },
    ],
  },
  {
    id: 'evolution',
    index: '10',
    title: 'EVOLUTION',
    blocks: [
      {
        kind: 'p',
        text: `Evolution requires Energy of at least ${EVOLUTION_MIN_ENERGY} and costs ${compact(EVOLUTION_COST)} $UNEST.`,
      },
      {
        kind: 'list',
        items: [`${EVOLUTION_SUCCESS_RATE}% — upgrade`, `${EVOLUTION_FAIL_RATE}% — no change`],
      },
      {
        kind: 'p',
        text: 'A successful evolution may improve traits, increase rarity and increase Reward Weight. A failure changes nothing.',
      },
      {
        kind: 'note',
        text: 'Reward Weight is not reduced on failure in the initial implementation. The fuel is spent either way.',
      },
    ],
  },
  {
    id: 'backing',
    index: '11',
    title: 'BACKING',
    blocks: [
      {
        kind: 'p',
        text: `Each EGG requires ${compact(BACKING_PER_EGG)} $UNEST of wallet backing. The $UNEST is not locked — it remains liquid — but the wallet balance determines how many EGGs the wallet can support.`,
      },
      {
        kind: 'code',
        text: `1 EGG   →   ${grouped(BACKING_PER_EGG)} $UNEST
3 EGG   →   ${grouped(BACKING_PER_EGG * 3)} $UNEST
10 EGG  →   ${grouped(BACKING_PER_EGG * 10)} $UNEST`,
      },
      {
        kind: 'warn',
        text: `If a wallet becomes under-backed, unsupported EGGs are burned according to protocol rules. Example: a wallet holding 10 EGGs on ${compact(BACKING_PER_EGG * 10)} $UNEST that falls to ${compact(BACKING_PER_EGG * 6)} $UNEST supports 6 EGGs — the other 4 are burned.`,
      },
    ],
  },
  {
    id: 'burns',
    index: '12',
    title: 'BURNS',
    blocks: [
      { kind: 'p', text: '$UNEST leaves circulation through the following sinks:' },
      {
        kind: 'list',
        items: [
          `HATCH — ${compact(HATCH_COST)} $UNEST`,
          `FEED — ${compact(FEED_COST)} $UNEST`,
          `BREED — ${compact(BREED_COST)} $UNEST`,
          `EVOLUTION — ${compact(EVOLUTION_COST)} $UNEST`,
          'BUYBACK — 3% of the fee allocation',
          'UNDER-BACKING — the EGG itself is burned',
        ],
      },
      {
        kind: 'p',
        text: 'Because supply is consumed continuously, the number of EGGs the economy can support falls over time.',
      },
    ],
  },
  {
    id: 'uniswap-v4-hooks',
    index: '13',
    title: 'UNISWAP V4 HOOKS',
    blocks: [
      {
        kind: 'p',
        text: 'A Uniswap v4 hook is contract code attached to a specific pool that executes as part of the swap lifecycle. UNEST uses hooks as the infrastructure layer enforcing pool-level mechanics.',
      },
      {
        kind: 'list',
        items: [
          'MINT ENGINE — detects qualifying purchases and creates Sealed EGGs',
          'FEE ENGINE — routes pool fees 90 / 5 / 3 / 2',
          'BACKING ENGINE — tracks EGG ownership against $UNEST balance',
          'REWARD ENGINE — distributes by Effective Reward Weight',
          'BUYBACK ENGINE — buys $UNEST and burns it',
          'BREEDING ENGINE — pairs creatures and issues new Sealed EGGs',
        ],
      },
      {
        kind: 'p',
        text: 'Because the hook runs inside the swap, the protocol observes what the pool actually did rather than inferring it from balances afterwards.',
      },
    ],
  },
  {
    id: 'contracts',
    index: '14',
    title: 'CONTRACTS',
    blocks: [
      {
        kind: 'p',
        text: 'All addresses live in a single configuration file and every page reads from it. Until the real deployment is supplied, entries render as placeholders and the interface states CONTRACT NOT CONFIGURED.',
      },
      {
        kind: 'list',
        items: [
          'UNEST_TOKEN_ADDRESS',
          'EGG_NFT_ADDRESS',
          'POOL_ID',
          'UNEST_HOOK_ADDRESS',
          'MINT_ENGINE_ADDRESS',
          'REWARD_ENGINE_ADDRESS',
          'BREEDING_ENGINE_ADDRESS',
          'TREASURY_ADDRESS',
          'CHAIN_ID',
        ],
      },
      { kind: 'note', text: 'No blockchain address is ever invented for display purposes.' },
    ],
  },
  {
    id: 'security',
    index: '15',
    title: 'SECURITY',
    blocks: [
      { kind: 'p', text: 'Verify everything before interacting with anything.' },
      {
        kind: 'list',
        items: [
          'Check the token contract on Etherscan',
          'Check the EGG NFT contract on Etherscan',
          'Check the pool on Uniswap',
          'Check the hook address attached to that pool',
          'Check the mint, reward and breeding engines',
          'Check the treasury address',
        ],
      },
      {
        kind: 'warn',
        text: 'UNEST does not claim to be audited, risk free, or to guarantee yield or rewards. Interacting with any on-chain protocol carries risk, including total loss.',
      },
    ],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is $UNEST?',
    a: `$UNEST is the ERC-20 token that fuels the protocol. Total supply ${grouped(UNEST_SUPPLY)}, ${UNEST_DECIMALS} decimals, on Ethereum mainnet. It is not the NFT.`,
  },
  {
    q: 'What is an EGG?',
    a: 'EGG is the ERC-721 NFT. It starts sealed, and once hatched it becomes a permanent creature with traits, rarity and a Reward Weight. It is not the token.',
  },
  {
    q: 'How do I mint an EGG?',
    a: `You do not mint directly. Every complete ${compact(MINT_UNIT)} $UNEST purchased from the official ETH/$UNEST Uniswap v4 pool creates one Sealed EGG through the mint hook.`,
  },
  {
    q: 'Do I have to lock my $UNEST?',
    a: `No. The ${compact(BACKING_PER_EGG)} $UNEST per EGG is a backing requirement, not custody. It stays liquid in your wallet and you can move or sell it at any time — doing so simply reduces how many EGGs your wallet supports.`,
  },
  {
    q: 'What happens when my wallet becomes under-backed?',
    a: `Unsupported EGGs are burned according to protocol rules. A wallet with ${compact(BACKING_PER_EGG * 10)} $UNEST supports 10 EGGs; if the balance falls to ${compact(BACKING_PER_EGG * 6)} $UNEST it supports 6, and the remaining 4 are burned.`,
  },
  {
    q: 'What happens when an EGG reaches zero Energy?',
    a: 'The creature hibernates. It stops generating rewards entirely until it is fed. It is not burned and it is not lost.',
  },
  {
    q: 'How does breeding work?',
    a: `Two creatures with Energy above 0 burn ${compact(BREED_COST)} $UNEST to produce a new Sealed EGG, then enter a ${BREED_COOLDOWN} day cooldown. The child inherits traits from both parents and each parent receives ${BREED_PARENT_ROYALTY_PCT}% of the child's rewards for ${BREED_ROYALTY_DAYS} days.`,
  },
  {
    q: 'What is Reward Weight?',
    a: `Reward Weight is a creature's base share of the reward pool. It starts at ${REWARD_WEIGHT_BASE}, gains a rarity bonus, can be increased by breeding and evolution, and is capped at ${REWARD_WEIGHT_CAP}. What actually counts is Effective Weight: Reward Weight × Energy %.`,
  },
  {
    q: 'What are Uniswap v4 Hooks?',
    a: 'Hooks are contracts attached to a specific Uniswap v4 pool that run as part of the swap. UNEST uses them to detect qualifying purchases, route fees, enforce backing, distribute rewards, run buybacks and handle breeding — at the pool level, where it cannot be faked.',
  },
  {
    q: 'Where can I verify the contracts?',
    a: 'On the Contracts page. Every entry links to Etherscan or Uniswap once the real address is configured. Until then it shows a placeholder and says CONTRACT NOT CONFIGURED, because no address is ever invented.',
  },
];
