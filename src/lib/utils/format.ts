/** Display helpers. Formatting lives here so components stay dumb. */

export function shortAddress(address?: string, size = 4): string {
  if (!address) return '—';
  if (address.length <= size * 2 + 2) return address;
  return `${address.slice(0, size + 2)}…${address.slice(-size)}`;
}

const UNITS: [number, string][] = [
  [1_000_000_000_000, 'T'],
  [1_000_000_000, 'B'],
  [1_000_000, 'M'],
  [1_000, 'K'],
];

/** 50000000 → "50M". Keeps the pixel UI narrow. */
export function compact(n: number, digits = 1): string {
  const abs = Math.abs(n);
  for (const [size, suffix] of UNITS) {
    if (abs >= size) {
      const v = n / size;
      const s = v % 1 === 0 ? v.toFixed(0) : v.toFixed(digits).replace(/\.0$/, '');
      return `${s}${suffix}`;
    }
  }
  return String(n);
}

/** 100000000000 → "100,000,000,000" */
export function grouped(n: number | bigint): string {
  return n.toLocaleString('en-US');
}

export function pct(n: number, digits = 0): string {
  return `${n.toFixed(digits)}%`;
}

export function padId(id: number, width = 3): string {
  return String(id).padStart(width, '0');
}

export function eggLabel(id: number): string {
  return `EGG #${padId(id)}`;
}

/** Formats a bigint token amount using its decimals, without pulling in a lib. */
export function formatUnitsCompact(value: bigint, decimals: number, digits = 2): string {
  const base = 10n ** BigInt(decimals);
  const whole = value / base;
  const frac = value % base;
  const asNumber = Number(whole) + Number(frac) / Number(base);
  if (asNumber >= 1000) return compact(asNumber, 1);
  return asNumber.toFixed(digits).replace(/\.?0+$/, '') || '0';
}

export function hoursToDays(hours: number): string {
  const d = hours / 24;
  return d === 1 ? '1 day' : `${d} days`;
}
