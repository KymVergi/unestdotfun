import { describe, expect, it } from 'vitest';
import {
  CHAIN_ID,
  CONTRACT_REGISTRY,
  NETWORK_NAME,
  etherscanAddress,
  etherscanTx,
  isConfigured,
  uniswapPool,
} from './contracts';
import { METADATA_BASE_URI, SITE_URL, X_HANDLE, X_URL, eggImageUrl, metadataUrl } from './site';

describe('network', () => {
  it('targets Ethereum mainnet', () => {
    expect(CHAIN_ID).toBe(1);
    expect(NETWORK_NAME).toBe('Ethereum Mainnet');
  });
});

describe('contract registry', () => {
  it('lists every module the protocol needs', () => {
    expect(CONTRACT_REGISTRY.map((e) => e.id)).toEqual([
      'token',
      'egg',
      'pool',
      'hook',
      'mint',
      'reward',
      'breeding',
      'treasury',
    ]);
  });

  it('never invents an address', () => {
    for (const entry of CONTRACT_REGISTRY) {
      if (entry.value === '') continue;
      // Anything non-empty must be a real, well-formed value from the env.
      const ok = /^0x[a-fA-F0-9]{40}$/.test(entry.value) || /^0x[a-fA-F0-9]{64}$/.test(entry.value);
      expect(ok, `${entry.id} → ${entry.value}`).toBe(true);
    }
  });

  it('offers no explorer link while an address is missing', () => {
    for (const entry of CONTRACT_REGISTRY) {
      if (entry.value === '') expect(entry.explorer).toBeNull();
    }
  });
});

describe('explorer helpers', () => {
  it('returns null instead of a broken link', () => {
    expect(etherscanAddress('')).toBeNull();
    expect(uniswapPool('')).toBeNull();
    expect(etherscanTx(undefined)).toBeNull();
  });

  it('builds a link once a value exists', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(etherscanAddress(address)).toBe(`https://etherscan.io/address/${address}`);
  });
});

describe('isConfigured', () => {
  it('treats the empty string as not configured', () => {
    expect(isConfigured('')).toBe(false);
    expect(isConfigured('0xabc')).toBe(true);
  });
});

describe('site config', () => {
  it('has no trailing slash on the canonical url', () => {
    expect(SITE_URL.endsWith('/')).toBe(false);
  });

  it('defaults the X account to the project handle', () => {
    expect(X_URL).toContain('x.com/');
    expect(X_HANDLE.startsWith('@')).toBe(true);
  });

  it('points token metadata at the site by default', () => {
    expect(METADATA_BASE_URI).toContain('/api/egg');
    expect(metadataUrl(7)).toBe(`${METADATA_BASE_URI}/7`);
    expect(eggImageUrl(7)).toBe(`${METADATA_BASE_URI}/7/image`);
  });
});
