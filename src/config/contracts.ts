/**
 * UNEST — CONTRACT REGISTRY
 * ---------------------------------------------------------------------------
 * NETWORK: ETHEREUM MAINNET (chainId 1).
 *
 * Every address here is a PLACEHOLDER until the real deployment is supplied.
 * NEVER invent an address. An empty string means "not configured" and the UI
 * is required to render `CONTRACT NOT CONFIGURED` instead of faking anything.
 *
 * To go live: fill the NEXT_PUBLIC_* variables in `.env.local` (see .env.example).
 */

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 1);

export const NETWORK_NAME = 'Ethereum Mainnet';
export const NETWORK_SHORT = 'ETHEREUM';

export const RPC_URL = (process.env.NEXT_PUBLIC_RPC_URL ?? '').trim();

/**
 * Optional subgraph / indexer endpoint.
 * When set, the population views (/creatures, /gallery) query it instead of
 * enumerating on-chain, which does not scale past a few hundred tokens.
 */
export const SUBGRAPH_URL = (process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? '').trim();

/** Optional WalletConnect v2 project id. Without it, only injected wallets. */
export const WALLETCONNECT_PROJECT_ID = (
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''
).trim();

/**
 * How many tokens the on-chain fallback will enumerate before giving up and
 * asking for a subgraph. Keeps a cold wallet from firing thousands of reads.
 */
export const ONCHAIN_ENUMERATION_LIMIT = Number(
  process.env.NEXT_PUBLIC_ONCHAIN_ENUMERATION_LIMIT ?? 120,
);

/** `0x…` when configured, empty string when not. */
export type MaybeAddress = `0x${string}` | '';

/**
 * NOTE: `process.env.NEXT_PUBLIC_*` must be read with STATIC member access so
 * that the bundler can inline the value into the client bundle. Dynamic
 * `process.env[key]` lookups silently resolve to undefined in the browser.
 */
function addr(raw: string | undefined): MaybeAddress {
  const v = (raw ?? '').trim();
  return /^0x[a-fA-F0-9]{40}$/.test(v) ? (v as `0x${string}`) : '';
}

function hash32(raw: string | undefined): `0x${string}` | '' {
  const v = (raw ?? '').trim();
  return /^0x[a-fA-F0-9]{64}$/.test(v) ? (v as `0x${string}`) : '';
}

/* -------------------------------------------------------------------------- */
/*  ADDRESSES                                                                 */
/* -------------------------------------------------------------------------- */

export const UNEST_TOKEN_ADDRESS: MaybeAddress = addr(process.env.NEXT_PUBLIC_UNEST_TOKEN_ADDRESS);
export const EGG_NFT_ADDRESS: MaybeAddress = addr(process.env.NEXT_PUBLIC_EGG_NFT_ADDRESS);
export const UNEST_HOOK_ADDRESS: MaybeAddress = addr(process.env.NEXT_PUBLIC_UNEST_HOOK_ADDRESS);
export const MINT_ENGINE_ADDRESS: MaybeAddress = addr(process.env.NEXT_PUBLIC_MINT_ENGINE_ADDRESS);
export const REWARD_ENGINE_ADDRESS: MaybeAddress = addr(
  process.env.NEXT_PUBLIC_REWARD_ENGINE_ADDRESS,
);
export const BREEDING_ENGINE_ADDRESS: MaybeAddress = addr(
  process.env.NEXT_PUBLIC_BREEDING_ENGINE_ADDRESS,
);
export const TREASURY_ADDRESS: MaybeAddress = addr(process.env.NEXT_PUBLIC_TREASURY_ADDRESS);

/** Uniswap v4 pools are identified by a bytes32 PoolId, not an address. */
export const POOL_ID: `0x${string}` | '' = hash32(process.env.NEXT_PUBLIC_POOL_ID);

/* -------------------------------------------------------------------------- */
/*  EXPLORERS                                                                 */
/* -------------------------------------------------------------------------- */

export const ETHERSCAN_BASE = 'https://etherscan.io';
export const UNISWAP_BASE = 'https://app.uniswap.org';

export function etherscanAddress(address: MaybeAddress): string | null {
  return address ? `${ETHERSCAN_BASE}/address/${address}` : null;
}

export function etherscanToken(address: MaybeAddress): string | null {
  return address ? `${ETHERSCAN_BASE}/token/${address}` : null;
}

export function etherscanTx(hash?: `0x${string}`): string | null {
  return hash ? `${ETHERSCAN_BASE}/tx/${hash}` : null;
}

export function uniswapPool(poolId: string): string | null {
  return poolId ? `${UNISWAP_BASE}/explore/pools/ethereum/${poolId}` : null;
}

/* -------------------------------------------------------------------------- */
/*  REGISTRY                                                                  */
/* -------------------------------------------------------------------------- */

export type RegistryKind = 'token' | 'nft' | 'pool' | 'hook' | 'engine' | 'treasury';

export interface RegistryEntry {
  id: string;
  name: string;
  kind: RegistryKind;
  standard: string;
  network: string;
  value: string;
  valueLabel: string;
  description: string;
  explorer: string | null;
  explorerLabel: string;
}

export const CONTRACT_REGISTRY: readonly RegistryEntry[] = [
  {
    id: 'token',
    name: '$UNEST TOKEN',
    kind: 'token',
    standard: 'ERC-20',
    network: NETWORK_NAME,
    value: UNEST_TOKEN_ADDRESS,
    valueLabel: 'Address',
    description: 'The fuel. 100,000,000,000 supply, 18 decimals.',
    explorer: etherscanToken(UNEST_TOKEN_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'egg',
    name: 'EGG NFT',
    kind: 'nft',
    standard: 'ERC-721',
    network: NETWORK_NAME,
    value: EGG_NFT_ADDRESS,
    valueLabel: 'Address',
    description: 'The creature. Sealed at mint, permanent after hatching.',
    explorer: etherscanAddress(EGG_NFT_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'pool',
    name: 'UNISWAP V4 POOL',
    kind: 'pool',
    standard: 'ETH / $UNEST',
    network: NETWORK_NAME,
    value: POOL_ID,
    valueLabel: 'Pool ID',
    description: 'The gate. Only qualifying purchases from this pool create EGGs.',
    explorer: uniswapPool(POOL_ID),
    explorerLabel: 'VIEW ON UNISWAP',
  },
  {
    id: 'hook',
    name: 'UNEST HOOK',
    kind: 'hook',
    standard: 'Uniswap v4 Hook',
    network: NETWORK_NAME,
    value: UNEST_HOOK_ADDRESS,
    valueLabel: 'Hook address',
    description: 'The engine attached to the pool. Enforces pool-level mechanics.',
    explorer: etherscanAddress(UNEST_HOOK_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'mint',
    name: 'MINT ENGINE',
    kind: 'engine',
    standard: 'Module',
    network: NETWORK_NAME,
    value: MINT_ENGINE_ADDRESS,
    valueLabel: 'Contract',
    description: 'Counts qualifying purchase volume and creates Sealed EGGs.',
    explorer: etherscanAddress(MINT_ENGINE_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'reward',
    name: 'REWARD ENGINE',
    kind: 'engine',
    standard: 'Module',
    network: NETWORK_NAME,
    value: REWARD_ENGINE_ADDRESS,
    valueLabel: 'Contract',
    description: 'Distributes fees by Effective Reward Weight.',
    explorer: etherscanAddress(REWARD_ENGINE_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'breeding',
    name: 'BREEDING ENGINE',
    kind: 'engine',
    standard: 'Module',
    network: NETWORK_NAME,
    value: BREEDING_ENGINE_ADDRESS,
    valueLabel: 'Contract',
    description: 'Pairs two active creatures and issues a new Sealed EGG.',
    explorer: etherscanAddress(BREEDING_ENGINE_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
  {
    id: 'treasury',
    name: 'TREASURY',
    kind: 'treasury',
    standard: 'Address',
    network: NETWORK_NAME,
    value: TREASURY_ADDRESS,
    valueLabel: 'Address',
    description: 'Receives 2% of the pool fee allocation.',
    explorer: etherscanAddress(TREASURY_ADDRESS),
    explorerLabel: 'VIEW ON ETHERSCAN',
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  STATUS                                                                    */
/* -------------------------------------------------------------------------- */

export function isConfigured(value: string): value is `0x${string}` {
  return value.length > 0;
}

/** True only when the core read/write surface is deployable. */
export const CORE_CONFIGURED = isConfigured(UNEST_TOKEN_ADDRESS) && isConfigured(EGG_NFT_ADDRESS);

export const NOT_CONFIGURED_LABEL = 'CONTRACT NOT CONFIGURED';
export const DEMO_LABEL = 'DEMO DATA';

/** Where the interface should read protocol state from, right now. */
export type DataSource = 'demo' | 'chain' | 'subgraph';

/**
 * Resolved once, from configuration alone.
 *  - no EGG address            → demo
 *  - EGG address + subgraph    → subgraph
 *  - EGG address only          → chain (bounded enumeration)
 */
export const POPULATION_SOURCE: DataSource = !isConfigured(EGG_NFT_ADDRESS)
  ? 'demo'
  : SUBGRAPH_URL
    ? 'subgraph'
    : 'chain';

/** The wallet's own Nest never needs an indexer — enumeration is per-owner. */
export const NEST_SOURCE: DataSource = isConfigured(EGG_NFT_ADDRESS) ? 'chain' : 'demo';

export const IS_DEMO = POPULATION_SOURCE === 'demo';

/** Explorer bases, re-exported for convenience. */
export const LINKS = {
  etherscan: ETHERSCAN_BASE,
  uniswap: UNISWAP_BASE,
} as const;
