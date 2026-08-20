import { NextResponse } from 'next/server';
import {
  MAX_ENERGY,
  THEORETICAL_MAX_EGGS,
  TRAIT_CATEGORIES,
  effectiveWeight,
  rarityOf,
} from '@/config/protocol';
import { EGG_NFT_ADDRESS, NETWORK_NAME, isConfigured } from '@/config/contracts';
import { SITE_URL, eggImageUrl } from '@/config/site';
import { creatureDNA } from '@/lib/pixel/dna';
import { creatureFromChain } from '@/lib/protocol/creature';
import { readCreature } from '@/lib/web3/server';

export const dynamic = 'force-dynamic';

interface Attribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage';
}

/**
 * ERC-721 metadata for one EGG.
 *
 * Point the contract's `tokenURI` at `<site>/api/egg/` and the collection
 * renders on marketplaces with no extra infrastructure.
 *
 * State comes from the chain whenever the EGG contract is configured. With no
 * contract — or an unreachable RPC — it serves clearly-labelled preview
 * metadata instead of pretending to know the token's real state.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tokenId = Number(id);

  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return NextResponse.json({ error: 'Invalid token id' }, { status: 400 });
  }

  const raw = await readCreature(tokenId);
  const live = raw !== null;

  const creature = live ? creatureFromChain(tokenId, raw) : null;

  const dna = creature?.dna ?? creatureDNA(tokenId);
  const isSealed = creature?.isSealed ?? false;
  const rarity = rarityOf(creature?.rarity ?? dna.rarity);

  const name = isSealed ? `Sealed EGG #${tokenId}` : `UNEST Creature #${tokenId}`;

  const description = isSealed
    ? 'A Sealed EGG from the UNEST Nest. Its traits are hidden until it is hatched. Hatching burns $UNEST and writes the creature permanently.'
    : 'A creature from the UNEST Nest — a living economic asset on Ethereum. It consumes $UNEST, produces rewards while it has Energy, and can breed and evolve. $UNEST is the ERC-20 token; EGG is this ERC-721 NFT.';

  const attributes: Attribute[] = [];

  attributes.push({ trait_type: 'STATE', value: isSealed ? 'SEALED' : 'HATCHED' });
  attributes.push({ trait_type: 'RARITY', value: rarity.label });

  if (!isSealed) {
    for (const category of TRAIT_CATEGORIES) {
      attributes.push({ trait_type: category, value: dna.traits[category] });
    }
  }

  if (creature) {
    attributes.push({
      trait_type: 'ENERGY',
      value: creature.energy,
      display_type: 'number',
    });
    attributes.push({
      trait_type: 'REWARD WEIGHT',
      value: creature.rewardWeight,
      display_type: 'number',
    });
    attributes.push({
      trait_type: 'EFFECTIVE WEIGHT',
      value: creature.isSealed ? 0 : effectiveWeight(creature.rewardWeight, creature.energy),
      display_type: 'number',
    });
    attributes.push({
      trait_type: 'GENERATION',
      value: creature.generation,
      display_type: 'number',
    });
    attributes.push({
      trait_type: 'BREED COUNT',
      value: creature.breedCount,
      display_type: 'number',
    });
    attributes.push({
      trait_type: 'EVOLUTION COUNT',
      value: creature.evolutionCount,
      display_type: 'number',
    });
  }

  const body = {
    name,
    description,
    image: eggImageUrl(tokenId),
    external_url: `${SITE_URL}/creatures`,
    background_color: '11130F',
    attributes,
    unest: {
      network: NETWORK_NAME,
      contract: isConfigured(EGG_NFT_ADDRESS) ? EGG_NFT_ADDRESS : null,
      /** false means this is preview metadata, not on-chain state. */
      onChain: live,
      maxEnergy: MAX_ENERGY,
      theoreticalMaxEggs: THEORETICAL_MAX_EGGS,
    },
  };

  return NextResponse.json(body, {
    headers: {
      // Sealed eggs and energy change; cache briefly but let marketplaces refresh.
      'Cache-Control': live
        ? 'public, max-age=30, stale-while-revalidate=300'
        : 'public, max-age=300',
    },
  });
}
