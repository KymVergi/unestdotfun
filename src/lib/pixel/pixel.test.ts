import { describe, expect, it } from 'vitest';
import { fromRows, makeGrid, mirrorX, outline, rect, toRuns, get } from './grid';
import { creatureDNA, eggDNA, rng } from './dna';
import { buildEgg, EGG_H, EGG_W } from './egg';
import { buildCreature, CREATURE_H, CREATURE_W } from './creature';
import { renderCreatureSvg, renderSealedEggSvg } from './svg';
import { REWARD_WEIGHT_CAP, TRAIT_CATEGORIES } from '@/config/protocol';

describe('grid engine', () => {
  it('round-trips rows into a grid', () => {
    const g = fromRows(['.#.', '###', '.#.']);
    expect(g.w).toBe(3);
    expect(g.h).toBe(3);
    expect(get(g, 1, 0)).toBe('#');
    expect(get(g, 0, 0)).toBe('');
  });

  it('pads short rows instead of throwing', () => {
    const g = fromRows(['####', '#']);
    expect(g.w).toBe(4);
    expect(get(g, 3, 1)).toBe('');
  });

  it('mirrors the left half onto the right', () => {
    const g = makeGrid(6, 1);
    rect(g, 0, 0, 2, 1, 'a');
    mirrorX(g);
    expect(get(g, 5, 0)).toBe('a');
    expect(get(g, 4, 0)).toBe('a');
    expect(get(g, 3, 0)).toBe('');
  });

  it('outlines only empty neighbours', () => {
    const g = makeGrid(5, 5);
    rect(g, 2, 2, 1, 1, 'b');
    outline(g, 'o');
    expect(get(g, 2, 2)).toBe('b');
    expect(get(g, 1, 2)).toBe('o');
    expect(get(g, 2, 1)).toBe('o');
    expect(get(g, 0, 0)).toBe('');
  });

  it('collapses horizontal runs', () => {
    const g = fromRows(['###..##']);
    const runs = toRuns(g);
    expect(runs).toHaveLength(2);
    expect(runs[0]).toMatchObject({ x: 0, len: 3 });
    expect(runs[1]).toMatchObject({ x: 5, len: 2 });
  });
});

describe('rng', () => {
  it('is deterministic for a given seed', () => {
    const a = rng(42);
    const b = rng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('stays inside [0, 1)', () => {
    const r = rng(7);
    for (let i = 0; i < 500; i += 1) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('creature DNA', () => {
  it('is stable for the same id', () => {
    expect(creatureDNA(123)).toEqual(creatureDNA(123));
    expect(eggDNA(9)).toEqual(eggDNA(9));
  });

  it('differs across ids', () => {
    const a = creatureDNA(1);
    const b = creatureDNA(2);
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it('always fills every trait category', () => {
    for (let id = 1; id <= 60; id += 1) {
      const dna = creatureDNA(id);
      for (const category of TRAIT_CATEGORIES) {
        expect(dna.traits[category], `id ${id} / ${category}`).toBeTruthy();
      }
    }
  });

  it('never exceeds the reward weight cap', () => {
    for (let id = 1; id <= 200; id += 1) {
      const dna = creatureDNA(id, { generation: 5 });
      expect(dna.rewardWeight).toBeLessThanOrEqual(REWARD_WEIGHT_CAP);
    }
  });

  it('respects an explicit rarity override', () => {
    expect(creatureDNA(5, { rarity: 'MYTHIC' }).rarity).toBe('MYTHIC');
  });
});

describe('egg sprite', () => {
  it('has the declared dimensions', () => {
    const { grid } = buildEgg({ id: 1 });
    expect(grid.w).toBe(EGG_W);
    expect(grid.h).toBe(EGG_H);
  });

  it('is horizontally symmetric before cracks are applied', () => {
    const { grid } = buildEgg({ id: 3 });
    for (let y = 0; y < grid.h; y += 1) {
      const left = get(grid, 0, y) !== '';
      const right = get(grid, grid.w - 1, y) !== '';
      expect(left, `row ${y}`).toBe(right);
    }
  });

  it('removes the crown of the shell when opened', () => {
    const closed = buildEgg({ id: 4 });
    const opened = buildEgg({ id: 4, open: true });
    const filled = (g: typeof closed.grid) => g.cells.filter((c) => c !== '').length;
    expect(filled(opened.grid)).toBeLessThan(filled(closed.grid));
  });

  it('adds pixels when cracked', () => {
    const plain = buildEgg({ id: 6 });
    const cracked = buildEgg({ id: 6, crack: 3 });
    expect(cracked.grid.cells.filter((c) => c === 'c').length).toBeGreaterThan(0);
    expect(plain.grid.cells.filter((c) => c === 'c').length).toBe(0);
  });
});

describe('creature sprite', () => {
  it('has the declared dimensions and is never empty', () => {
    for (const id of [1, 17, 42, 999]) {
      const { grid } = buildCreature(id);
      expect(grid.w).toBe(CREATURE_W);
      expect(grid.h).toBe(CREATURE_H);
      expect(grid.cells.filter((c) => c !== '').length).toBeGreaterThan(40);
    }
  });

  it('only uses palette keys it defines', () => {
    for (let id = 1; id <= 40; id += 1) {
      const { grid, palette } = buildCreature(id);
      for (const cell of grid.cells) {
        if (cell === '') continue;
        expect(palette[cell], `id ${id} key ${cell}`).toBeTruthy();
      }
    }
  });
});

describe('server svg', () => {
  it('renders a self-contained svg for a creature', () => {
    const svg = renderCreatureSvg(11);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).not.toContain('undefined');
  });

  it('renders a sealed egg differently from a creature', () => {
    expect(renderSealedEggSvg(11)).not.toBe(renderCreatureSvg(11));
  });

  it('is deterministic', () => {
    expect(renderCreatureSvg(77)).toBe(renderCreatureSvg(77));
  });
});
