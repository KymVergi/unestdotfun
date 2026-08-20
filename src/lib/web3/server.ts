import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { EGG_NFT_ADDRESS, RPC_URL, isConfigured } from '@/config/contracts';
import { eggNftAbi } from '@/lib/web3/abis';
import type { ChainCreature } from '@/lib/protocol/creature';

/**
 * A read-only mainnet client for server routes (metadata, social cards).
 * Created lazily so nothing tries to reach the network at build time.
 */
let client: PublicClient | null = null;

export function publicClient(): PublicClient {
  if (!client) {
    client = createPublicClient({
      chain: mainnet,
      transport: http(RPC_URL || undefined),
    }) as PublicClient;
  }
  return client;
}

/**
 * Reads a creature straight from the EGG contract.
 * Returns null when the contract is not configured, the token does not exist,
 * or the RPC is unreachable — callers fall back to preview metadata rather
 * than inventing state.
 */
export async function readCreature(tokenId: number): Promise<ChainCreature | null> {
  if (!isConfigured(EGG_NFT_ADDRESS)) return null;

  try {
    const result = await publicClient().readContract({
      address: EGG_NFT_ADDRESS,
      abi: eggNftAbi,
      functionName: 'creatureOf',
      args: [BigInt(tokenId)],
    });
    return result as unknown as ChainCreature;
  } catch {
    return null;
  }
}

export async function readTotalSupply(): Promise<number | null> {
  if (!isConfigured(EGG_NFT_ADDRESS)) return null;
  try {
    const result = await publicClient().readContract({
      address: EGG_NFT_ADDRESS,
      abi: eggNftAbi,
      functionName: 'totalSupply',
    });
    return Number(result);
  } catch {
    return null;
  }
}
