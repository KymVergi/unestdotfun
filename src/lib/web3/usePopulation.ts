'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReadContract, useReadContracts } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
  EGG_NFT_ADDRESS,
  ONCHAIN_ENUMERATION_LIMIT,
  POPULATION_SOURCE,
  SUBGRAPH_URL,
  isConfigured,
  type DataSource,
} from '@/config/contracts';
import { eggNftAbi } from '@/lib/web3/abis';
import { creatureFromChain, type ChainCreature, type Creature } from '@/lib/protocol/creature';
import { useNowSeconds } from '@/lib/hooks/useNowSeconds';
import { DEMO_CREATURES } from '@/lib/data/creatures';

export interface PopulationResult {
  creatures: Creature[];
  source: DataSource;
  isLoading: boolean;
  isError: boolean;
  truncated: boolean;
  total: number;
}

/* -------------------------------------------------------------------------- */
/*  SUBGRAPH                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The query the indexer is expected to answer. Keep an entity named `eggs`
 * with these fields and the interface works with no code change.
 */
const POPULATION_QUERY = `
  query Population($first: Int!) {
    eggs(first: $first, orderBy: tokenId, orderDirection: asc) {
      tokenId
      sealed
      rarity
      energy
      rewardWeight
      generation
      breedCount
      evolutionCount
      lastFedAt
      breedReadyAt
    }
  }
`;

interface SubgraphEgg {
  tokenId: string;
  sealed: boolean;
  rarity: number | string;
  energy: number | string;
  rewardWeight: number | string;
  generation: number | string;
  breedCount: number | string;
  evolutionCount: number | string;
  lastFedAt: number | string;
  breedReadyAt: number | string;
}

function fromSubgraph(egg: SubgraphEgg, now: number): Creature {
  return creatureFromChain(
    Number(egg.tokenId),
    {
      sealed_: Boolean(egg.sealed),
      rarity: Number(egg.rarity),
      energy: Number(egg.energy),
      rewardWeight: Number(egg.rewardWeight),
      generation: Number(egg.generation),
      breedCount: Number(egg.breedCount),
      evolutionCount: Number(egg.evolutionCount),
      lastFedAt: BigInt(egg.lastFedAt ?? 0),
      breedReadyAt: BigInt(egg.breedReadyAt ?? 0),
    } satisfies ChainCreature,
    now,
  );
}

async function fetchPopulation(first: number): Promise<Creature[]> {
  const res = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: POPULATION_QUERY, variables: { first } }),
  });
  if (!res.ok) throw new Error(`Subgraph responded ${res.status}`);

  const json = (await res.json()) as { data?: { eggs?: SubgraphEgg[] }; errors?: unknown };
  if (json.errors) throw new Error('Subgraph returned errors');

  const now = Math.floor(Date.now() / 1000);
  return (json.data?.eggs ?? []).map((e) => fromSubgraph(e, now));
}

/* -------------------------------------------------------------------------- */
/*  HOOK                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The whole EGG population for /creatures and /gallery.
 *
 *   subgraph configured  → one indexed query, scales to the full collection
 *   EGG address only     → bounded on-chain enumeration
 *   nothing configured   → DEMO DATA, clearly labelled
 */
export function usePopulation(limit = ONCHAIN_ENUMERATION_LIMIT): PopulationResult {
  const address = isConfigured(EGG_NFT_ADDRESS) ? EGG_NFT_ADDRESS : undefined;
  const useSubgraph = POPULATION_SOURCE === 'subgraph';
  const useChain = POPULATION_SOURCE === 'chain';
  const now = useNowSeconds();

  /* ---- subgraph -------------------------------------------------------- */
  const subgraph = useQuery({
    queryKey: ['unest', 'population', SUBGRAPH_URL, limit],
    queryFn: () => fetchPopulation(limit),
    enabled: useSubgraph,
    staleTime: 30_000,
  });

  /* ---- on-chain fallback ----------------------------------------------- */
  const { data: supply, isLoading: loadingSupply } = useReadContract({
    address,
    abi: eggNftAbi,
    functionName: 'totalSupply',
    chainId: mainnet.id,
    query: { enabled: useChain },
  });

  const total = Number(supply ?? 0n);
  const take = Math.min(total, limit);

  const idContracts = useMemo(() => {
    if (!address || !useChain) return [];
    return Array.from({ length: take }, (_, i) => ({
      address,
      abi: eggNftAbi,
      functionName: 'tokenByIndex' as const,
      args: [BigInt(i)] as const,
      chainId: mainnet.id,
    }));
  }, [address, take, useChain]);

  const { data: idResults, isLoading: loadingIds } = useReadContracts({
    contracts: idContracts,
    query: { enabled: useChain && take > 0 },
  });

  const tokenIds = useMemo(
    () =>
      (idResults ?? [])
        .map((r) => (r.status === 'success' ? Number(r.result as bigint) : null))
        .filter((v): v is number => v !== null),
    [idResults],
  );

  const stateContracts = useMemo(() => {
    if (!address || !useChain) return [];
    return tokenIds.map((id) => ({
      address,
      abi: eggNftAbi,
      functionName: 'creatureOf' as const,
      args: [BigInt(id)] as const,
      chainId: mainnet.id,
    }));
  }, [address, tokenIds, useChain]);

  const { data: stateResults, isLoading: loadingStates } = useReadContracts({
    contracts: stateContracts,
    query: { enabled: useChain && tokenIds.length > 0 },
  });

  const chainCreatures = useMemo(() => {
    return tokenIds
      .map((id, i) => {
        const result = stateResults?.[i];
        if (!result || result.status !== 'success') return null;
        return creatureFromChain(id, result.result as unknown as ChainCreature, now);
      })
      .filter((c): c is Creature => c !== null);
  }, [tokenIds, stateResults, now]);

  /* ---- resolve --------------------------------------------------------- */
  if (useSubgraph) {
    const creatures = subgraph.data ?? [];
    return {
      creatures,
      source: 'subgraph',
      isLoading: subgraph.isLoading,
      isError: subgraph.isError,
      truncated: creatures.length >= limit,
      total: creatures.length,
    };
  }

  if (useChain) {
    return {
      creatures: chainCreatures,
      source: 'chain',
      isLoading: loadingSupply || loadingIds || loadingStates,
      isError: false,
      truncated: total > take,
      total,
    };
  }

  return {
    creatures: DEMO_CREATURES,
    source: 'demo',
    isLoading: false,
    isError: false,
    truncated: false,
    total: DEMO_CREATURES.length,
  };
}
