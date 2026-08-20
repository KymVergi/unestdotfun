import { describe, expect, it } from 'vitest';
import {
  BACKING_PER_EGG,
  ENERGY_DECAY,
  MAX_ENERGY,
  MINT_UNIT,
  REWARD_DISTRIBUTION,
  REWARD_WEIGHT_BASE,
  REWARD_WEIGHT_CAP,
  THEORETICAL_MAX_EGGS,
  UNEST_SUPPLY,
  effectiveWeight,
  energyState,
  rarityOf,
  supportedEggs,
} from '@/config/protocol';
import { currentEnergy, hoursUntilHibernation, secondsUntil } from './energy';

describe('economic constants', () => {
  it('derives the theoretical maximum from supply and mint unit', () => {
    expect(THEORETICAL_MAX_EGGS).toBe(UNEST_SUPPLY / MINT_UNIT);
    expect(THEORETICAL_MAX_EGGS).toBe(2_000);
  });

  it('splits pool fees 90 / 5 / 3 / 2', () => {
    expect(REWARD_DISTRIBUTION.map((r) => r.pct)).toEqual([90, 5, 3, 2]);
    expect(REWARD_DISTRIBUTION.reduce((a, r) => a + r.pct, 0)).toBe(100);
  });

  it('backs one EGG with one mint unit', () => {
    expect(BACKING_PER_EGG).toBe(MINT_UNIT);
  });
});

describe('effectiveWeight', () => {
  it('is the full weight at full energy', () => {
    expect(effectiveWeight(300, 100)).toBe(300);
  });

  it('is a quarter of the weight at a quarter energy — the whitepaper example', () => {
    expect(effectiveWeight(300, 25)).toBe(75);
  });

  it('is zero when hibernating', () => {
    expect(effectiveWeight(400, 0)).toBe(0);
  });

  it('never exceeds the weight, whatever energy is passed', () => {
    expect(effectiveWeight(200, 999)).toBe(200);
    expect(effectiveWeight(200, -50)).toBe(0);
  });
});

describe('rarity bonuses', () => {
  it('keeps every rarity within the hard cap', () => {
    for (const id of ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'MYTHIC'] as const) {
      const total = REWARD_WEIGHT_BASE + rarityOf(id).bonus;
      expect(total).toBeLessThanOrEqual(REWARD_WEIGHT_CAP);
    }
  });

  it('orders bonuses from common to mythic', () => {
    const bonuses = (['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY', 'MYTHIC'] as const).map(
      (id) => rarityOf(id).bonus,
    );
    expect(bonuses).toEqual([0, 10, 30, 75, 150]);
    expect([...bonuses].sort((a, b) => a - b)).toEqual(bonuses);
  });
});

describe('supportedEggs', () => {
  it('supports one EGG per full mint unit and never rounds up', () => {
    expect(supportedEggs(BACKING_PER_EGG)).toBe(1);
    expect(supportedEggs(BACKING_PER_EGG * 3)).toBe(3);
    expect(supportedEggs(BACKING_PER_EGG * 10)).toBe(10);
    expect(supportedEggs(BACKING_PER_EGG * 1.99)).toBe(1);
    expect(supportedEggs(0)).toBe(0);
  });

  it('reproduces the under-backing example from the docs', () => {
    const held = 10;
    const balance = BACKING_PER_EGG * 6;
    const supported = supportedEggs(balance);
    expect(supported).toBe(6);
    expect(held - supported).toBe(4);
  });
});

describe('energyState', () => {
  it('labels the ladder', () => {
    expect(energyState(100).id).toBe('happy');
    expect(energyState(80).id).toBe('active');
    expect(energyState(60).id).toBe('hungry');
    expect(energyState(30).id).toBe('weak');
    expect(energyState(0).id).toBe('hibernating');
  });
});

describe('currentEnergy', () => {
  const DAY = 24 * 3600;

  it('leaves energy untouched before a full period elapses', () => {
    const now = 1_000_000;
    expect(currentEnergy(100, now - DAY + 1, now)).toBe(100);
  });

  it('applies exactly one decay step per period', () => {
    const now = 1_000_000;
    expect(currentEnergy(100, now - DAY, now)).toBe(100 - ENERGY_DECAY);
    expect(currentEnergy(100, now - 3 * DAY, now)).toBe(100 - 3 * ENERGY_DECAY);
  });

  it('floors at zero rather than going negative', () => {
    const now = 1_000_000;
    expect(currentEnergy(50, now - 100 * DAY, now)).toBe(0);
  });

  it('caps at the maximum', () => {
    expect(currentEnergy(500, 0, 0)).toBe(MAX_ENERGY);
  });

  it('treats a missing timestamp as no decay', () => {
    expect(currentEnergy(64, 0, 1_000_000)).toBe(64);
  });
});

describe('hoursUntilHibernation', () => {
  it('is zero once hibernating', () => {
    expect(hoursUntilHibernation(0)).toBe(0);
  });

  it('counts one period per decay step remaining', () => {
    expect(hoursUntilHibernation(100)).toBe(240);
    expect(hoursUntilHibernation(50)).toBe(120);
  });
});

describe('secondsUntil', () => {
  it('never returns a negative countdown', () => {
    expect(secondsUntil(100, 500)).toBe(0);
    expect(secondsUntil(600, 500)).toBe(100);
  });
});
