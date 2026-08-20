import { erc20Abi } from 'viem';

export { erc20Abi };

/**
 * Minimal read/write surface the interface expects from the deployed contracts.
 * These are the shapes the UI calls against once real addresses are configured.
 * Nothing here is invoked while an address is empty.
 */

export const eggNftAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'tokenOfOwnerByIndex',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'tokenByIndex',
    stateMutability: 'view',
    inputs: [{ name: 'index', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'creatureOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'sealed_', type: 'bool' },
          { name: 'rarity', type: 'uint8' },
          { name: 'energy', type: 'uint16' },
          { name: 'rewardWeight', type: 'uint16' },
          { name: 'generation', type: 'uint16' },
          { name: 'breedCount', type: 'uint16' },
          { name: 'evolutionCount', type: 'uint16' },
          { name: 'lastFedAt', type: 'uint64' },
          { name: 'breedReadyAt', type: 'uint64' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'hatch',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'feed',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'evolve',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
] as const;

export const breedingEngineAbi = [
  {
    type: 'function',
    name: 'breed',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'parentA', type: 'uint256' },
      { name: 'parentB', type: 'uint256' },
    ],
    outputs: [{ name: 'childId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'cooldownOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint64' }],
  },
] as const;

export const rewardEngineAbi = [
  {
    type: 'function',
    name: 'pendingRewards',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalEffectiveWeight',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'claim',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
] as const;
