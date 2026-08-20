'use client';

import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
  EGG_NFT_ADDRESS,
  NEST_SOURCE,
  ONCHAIN_ENUMERATION_LIMIT,
  isConfigured,
  type DataSource,
} from '@/config/contracts';
import { eggNftAbi } from '@/lib/web3/abis';
import { creatureFromChain, type ChainCreature, type Creature } from '@/lib/protocol/creature';
import { useNowSeconds } from '@/lib/hooks/useNowSeconds';
import { DEMO_NEST } from '@/lib/data/creatures';

export interface NestResult {
  creatures: Creature[];
  source: DataSource;
  isLoading: boolean;
  isError: boolean;
  /** True when the wallet holds more EGGs than we enumerated. */
  truncated: boolean;
  total: number;
  refetch: () => void;
}

/**
 * The wallet's own EGGs, read straight from the NFT contract.
 *
 * Enumeration is per-owner, so no indexer is needed here: balanceOf then
 * tokenOfOwnerByIndex then creatureOf, batched through multicall by wagmi.
 * With no EGG address configured it returns DEMO DATA and says so.
 */
export function useNest(owner?: `0x${string}`): NestResult {
  const address = isConfigured(EGG_NFT_ADDRESS) ? EGG_NFT_ADDRESS : undefined;
  const enabled = Boolean(address && owner);
  const now = useNowSeconds();

  const {
    data: balance,
    isLoading: loadingBalance,
    isError: balanceError,
    refetch: refetchBalance,
  } = useReadContract({
    address,
    abi: eggNftAbi,
    functionName: 'balanceOf',
    args: owner ? [owner] : undefined,
    chainId: mainnet.id,
    query: { enabled },
  });

  const total = Number(balance ?? 0n);
  const take = Math.min(total, ONCHAIN_ENUMERATION_LIMIT);

  const indexContracts = useMemo(() => {
    if (!address || !owner) return [];
    return Array.from({ length: take }, (_, i) => ({
      address,
      abi: eggNftAbi,
      functionName: 'tokenOfOwnerByIndex' as const,
      args: [owner, BigInt(i)] as const,
      chainId: mainnet.id,
    }));
  }, [address, owner, take]);

  const {
    data: idResults,
    isLoading: loadingIds,
    isError: idsError,
    refetch: refetchIds,
  } = useReadContracts({
    contracts: indexContracts,
    query: { enabled: enabled && take > 0 },
  });

  const tokenIds = useMemo(
    () =>
      (idResults ?? [])
        .map((r) => (r.status === 'success' ? Number(r.result as bigint) : null))
        .filter((v): v is number => v !== null),
    [idResults],
  );

  const stateContracts = useMemo(() => {
    if (!address) return [];
    return tokenIds.map((id) => ({
      address,
      abi: eggNftAbi,
      functionName: 'creatureOf' as const,
      args: [BigInt(id)] as const,
      chainId: mainnet.id,
    }));
  }, [address, tokenIds]);

  const {
    data: stateResults,
    isLoading: loadingStates,
    isError: statesError,
    refetch: refetchStates,
  } = useReadContracts({
    contracts: stateContracts,
    query: { enabled: enabled && tokenIds.length > 0 },
  });

  const creatures = useMemo(() => {
    if (NEST_SOURCE === 'demo') return DEMO_NEST;
    return tokenIds
      .map((id, i) => {
        const result = stateResults?.[i];
        if (!result || result.status !== 'success') return null;
        return creatureFromChain(id, result.result as unknown as ChainCreature, now);
      })
      .filter((c): c is Creature => c !== null);
  }, [tokenIds, stateResults, now]);

  if (NEST_SOURCE === 'demo') {
    return {
      creatures: DEMO_NEST,
      source: 'demo',
      isLoading: false,
      isError: false,
      truncated: false,
      total: DEMO_NEST.length,
      refetch: () => {},
    };
  }

  return {
    creatures,
    source: 'chain',
    isLoading: loadingBalance || loadingIds || loadingStates,
    isError: balanceError || idsError || statesError,
    truncated: total > take,
    total,
    refetch: () => {
      void refetchBalance();
      void refetchIds();
      void refetchStates();
    },
  };
}
