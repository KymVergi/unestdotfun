/**
 * UNEST — SITE CONFIGURATION
 * ---------------------------------------------------------------------------
 * Identity, canonical URL and outbound links. Everything overridable by env so
 * a deployment never requires a code change.
 */

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();

/** Canonical origin, no trailing slash. */
export const SITE_URL = (rawSiteUrl || 'https://unest.fun').replace(/\/+$/, '');

export const SITE_NAME = 'UNEST';
export const SITE_TAGLINE = 'FEED THE NEST.';
export const SITE_DESCRIPTION =
  '$UNEST is the ERC-20 fuel for EGG, an ERC-721 creature economy on Ethereum, powered by Uniswap v4 hooks.';

/* -------------------------------------------------------------------------- */
/*  OUTBOUND LINKS                                                            */
/* -------------------------------------------------------------------------- */

export const X_URL = (process.env.NEXT_PUBLIC_X_URL ?? '').trim() || 'https://x.com/unest_fun';
export const X_HANDLE = `@${X_URL.replace(/\/+$/, '').split('/').pop() ?? 'unest_fun'}`;

export const DISCORD_URL = (process.env.NEXT_PUBLIC_DISCORD_URL ?? '').trim();
export const TELEGRAM_URL = (process.env.NEXT_PUBLIC_TELEGRAM_URL ?? '').trim();
export const GITHUB_URL = (process.env.NEXT_PUBLIC_GITHUB_URL ?? '').trim();

export interface SocialLink {
  label: string;
  href: string;
}

/** Only the links that are actually configured. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'X', href: X_URL },
  { label: 'DISCORD', href: DISCORD_URL },
  { label: 'TELEGRAM', href: TELEGRAM_URL },
  { label: 'GITHUB', href: GITHUB_URL },
].filter((l): l is SocialLink => Boolean(l.href));

/* -------------------------------------------------------------------------- */
/*  NFT METADATA                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Base URI the EGG contract's tokenURI should point at.
 * Defaults to this site's own metadata API, so the collection renders
 * correctly on marketplaces from day one.
 */
export const METADATA_BASE_URI =
  (process.env.NEXT_PUBLIC_METADATA_BASE_URI ?? '').trim().replace(/\/+$/, '') ||
  `${SITE_URL}/api/egg`;

export function metadataUrl(id: number | string): string {
  return `${METADATA_BASE_URI}/${id}`;
}

export function eggImageUrl(id: number | string): string {
  return `${METADATA_BASE_URI}/${id}/image`;
}
