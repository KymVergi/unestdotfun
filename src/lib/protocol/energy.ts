import { ENERGY_DECAY, ENERGY_DECAY_PERIOD_HOURS, MAX_ENERGY } from '@/config/protocol';

const SECONDS_PER_HOUR = 3600;

export function clampEnergy(value: number): number {
  return Math.max(0, Math.min(MAX_ENERGY, Math.round(value)));
}

/**
 * Energy as it stands *now*, derived from the last stored value and the time
 * since the creature was last fed.
 *
 * Contracts normally store energy lazily — they write it on feed and let it
 * decay implicitly — so the interface has to apply the same decay the contract
 * would apply on the next interaction, or the numbers on screen will lie.
 */
export function currentEnergy(
  storedEnergy: number,
  lastFedAtSeconds: number,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): number {
  if (!lastFedAtSeconds) return clampEnergy(storedEnergy);
  const elapsedHours = Math.max(0, (nowSeconds - lastFedAtSeconds) / SECONDS_PER_HOUR);
  const periods = Math.floor(elapsedHours / ENERGY_DECAY_PERIOD_HOURS);
  return clampEnergy(storedEnergy - periods * ENERGY_DECAY);
}

/** Hours left before the creature hits 0 and hibernates. */
export function hoursUntilHibernation(energy: number): number {
  const clamped = clampEnergy(energy);
  if (clamped <= 0) return 0;
  return Math.ceil(clamped / ENERGY_DECAY) * ENERGY_DECAY_PERIOD_HOURS;
}

/** "3d 4h" — compact countdown for the dashboard. */
export function formatHours(hours: number): string {
  if (hours <= 0) return 'NOW';
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  if (d && h) return `${d}d ${h}h`;
  if (d) return `${d}d`;
  return `${h}h`;
}

/** Seconds remaining on a cooldown timestamp, never negative. */
export function secondsUntil(
  targetSeconds: number,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): number {
  return Math.max(0, targetSeconds - nowSeconds);
}
