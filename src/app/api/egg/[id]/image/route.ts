import { renderEggOrCreature } from '@/lib/pixel/svg';
import { readCreature } from '@/lib/web3/server';

export const dynamic = 'force-dynamic';

/**
 * The token image, rendered as pixel SVG from the same DNA the site uses.
 * No image files, no CDN, no pinning — the art is a pure function of the id.
 */
export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tokenId = Number(id);

  if (!Number.isInteger(tokenId) || tokenId < 0) {
    return new Response('Invalid token id', { status: 400 });
  }

  const raw = await readCreature(tokenId);
  const isSealed = raw ? Boolean(raw.sealed_) : false;

  const svg = renderEggOrCreature(tokenId, isSealed);

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': raw
        ? 'public, max-age=60, stale-while-revalidate=600'
        : 'public, max-age=3600',
    },
  });
}
