'use client';

import { useMemo, useState } from 'react';
import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import Badge from '@/components/pixel/Badge/Badge';
import {
  RARITIES,
  TRAIT_CATEGORIES,
  TRAIT_VALUES,
  rarityOf,
  effectiveWeight,
} from '@/config/protocol';
import type { TraitCategory } from '@/config/protocol';
import { DEMO_LABEL } from '@/config/contracts';
import { usePopulation } from '@/lib/web3/usePopulation';
import { eggLabel } from '@/lib/utils/format';
import styles from './GalleryGrid.module.css';

type SortKey = 'ID' | 'RARITY' | 'WEIGHT' | 'GENERATION' | 'ENERGY';

const SORTS: SortKey[] = ['ID', 'RARITY', 'WEIGHT', 'GENERATION', 'ENERGY'];

const RARITY_ORDER = RARITIES.map((r) => r.id);

export function GalleryGrid() {
  const [sort, setSort] = useState<SortKey>('ID');
  const [category, setCategory] = useState<TraitCategory>('BODY');
  const [value, setValue] = useState<string>('ALL');

  const { creatures, source, isLoading } = usePopulation();

  const items = useMemo(() => {
    const filtered = creatures.filter((c) => value === 'ALL' || c.traits[category] === value);

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'RARITY':
          return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity) || a.id - b.id;
        case 'WEIGHT':
          return b.rewardWeight - a.rewardWeight || a.id - b.id;
        case 'GENERATION':
          return b.generation - a.generation || a.id - b.id;
        case 'ENERGY':
          return b.energy - a.energy || a.id - b.id;
        default:
          return a.id - b.id;
      }
    });

    return sorted;
  }, [creatures, sort, category, value]);

  return (
    <div className={styles.wrap}>
      <div className={styles.badges}>
        {source === 'demo' ? (
          <Badge tone="yolk">{DEMO_LABEL}</Badge>
        ) : (
          <Badge tone="live" dot>
            {isLoading ? 'READING…' : source === 'subgraph' ? 'LIVE · INDEXED' : 'LIVE · ON-CHAIN'}
          </Badge>
        )}
        <Badge tone="muted">{TRAIT_CATEGORIES.length} TRAIT CATEGORIES</Badge>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>SORT BY</span>
          <div className={styles.chips}>
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                className={[styles.chip, sort === s ? styles.chipOn : ''].join(' ')}
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <span className={styles.groupLabel}>TRAIT</span>
          <div className={styles.selects}>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as TraitCategory);
                setValue('ALL');
              }}
              aria-label="Trait category"
            >
              {TRAIT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Trait value"
            >
              <option value="ALL">ALL VALUES</option>
              {TRAIT_VALUES[category].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className={styles.result}>
          {items.length} / {creatures.length}
        </span>
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>NOTHING IN THE COOP MATCHES THAT COMBINATION.</p>
      ) : (
        <ul className={styles.grid}>
          {items.map((c) => {
            const rarity = rarityOf(c.rarity);
            return (
              <li
                key={c.id}
                className={styles.tile}
                style={{ '--rarity': rarity.color } as React.CSSProperties}
              >
                <div className={styles.art}>
                  <PixelCreature id={c.id} dna={c.dna} className={styles.sprite} />
                </div>

                <div className={styles.meta}>
                  <span className={styles.id}>{eggLabel(c.id)}</span>
                  <span className={styles.rarity}>{rarity.label}</span>
                </div>

                <div className={styles.numbers}>
                  <span title="Reward Weight">W {c.rewardWeight}</span>
                  <span title="Energy">E {c.energy}</span>
                  <span title="Generation">G {c.generation}</span>
                </div>

                <div className={styles.hover}>
                  <span className={styles.hoverTitle}>{eggLabel(c.id)}</span>
                  <dl>
                    {TRAIT_CATEGORIES.map((cat) => (
                      <div key={cat}>
                        <dt>{cat}</dt>
                        <dd>{c.traits[cat]}</dd>
                      </div>
                    ))}
                    <div className={styles.hoverStrong}>
                      <dt>EFFECTIVE</dt>
                      <dd>{effectiveWeight(c.rewardWeight, c.energy)}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default GalleryGrid;
