'use client';

import { useMemo, useState } from 'react';
import CreatureCard from '@/components/creatures/CreatureCard/CreatureCard';
import Badge from '@/components/pixel/Badge/Badge';
import Stat, { StatGrid } from '@/components/pixel/Stat/Stat';
import { RARITIES, REWARD_WEIGHT_BASE, type RarityId } from '@/config/protocol';
import { DEMO_LABEL } from '@/config/contracts';
import { usePopulation } from '@/lib/web3/usePopulation';
import styles from './CreatureExplorer.module.css';

type Filter = 'ALL' | RarityId;

const FILTERS: Filter[] = ['ALL', ...RARITIES.map((r) => r.id)];

export function CreatureExplorer() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');

  const { creatures, source, isLoading, isError, truncated, total } = usePopulation();

  const visible = useMemo(() => {
    const q = query.trim().replace(/^#/, '');
    return creatures.filter((c) => {
      if (filter !== 'ALL' && c.rarity !== filter) return false;
      if (q && !String(c.id).includes(q)) return false;
      return true;
    });
  }, [creatures, filter, query]);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>();
    map.set('ALL', creatures.length);
    RARITIES.forEach((r) => map.set(r.id, creatures.filter((c) => c.rarity === r.id).length));
    return map;
  }, [creatures]);

  const active = creatures.filter((c) => !c.isSealed && c.energy > 0).length;
  const hibernating = creatures.filter((c) => !c.isSealed && c.energy <= 0).length;
  const avgWeight = creatures.length
    ? Math.round(creatures.reduce((a, c) => a + c.rewardWeight, 0) / creatures.length)
    : REWARD_WEIGHT_BASE;

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <div className={styles.badges}>
          {source === 'demo' ? (
            <Badge tone="yolk">{DEMO_LABEL}</Badge>
          ) : (
            <Badge tone="live" dot>
              {isLoading
                ? 'READING…'
                : source === 'subgraph'
                  ? 'LIVE · INDEXED'
                  : 'LIVE · ON-CHAIN'}
            </Badge>
          )}
          {truncated ? (
            <Badge tone="barn">
              FIRST {creatures.length} OF {total}
            </Badge>
          ) : null}
          {isError ? <Badge tone="barn">READ FAILED</Badge> : null}
        </div>

        <StatGrid columns={4}>
          <Stat size="sm" value={creatures.length} label="CREATURES SHOWN" accent="yolk" />
          <Stat size="sm" value={active} label="ACTIVE" accent="green" />
          <Stat size="sm" value={hibernating} label="HIBERNATING" accent="barn" />
          <Stat size="sm" value={avgWeight} label="AVG REWARD WEIGHT" accent="plain" />
        </StatGrid>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter by rarity">
          {FILTERS.map((f) => {
            const rarity = RARITIES.find((r) => r.id === f);
            return (
              <button
                key={f}
                type="button"
                className={[styles.chip, filter === f ? styles.chipOn : ''].join(' ')}
                style={rarity ? ({ '--chip': rarity.color } as React.CSSProperties) : undefined}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f}
                <span className={styles.count}>{counts.get(f) ?? 0}</span>
              </button>
            );
          })}
        </div>

        <label className={styles.search}>
          <span className="visuallyHidden">Search by EGG id</span>
          <input
            type="search"
            inputMode="numeric"
            placeholder="SEARCH #ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {isLoading && creatures.length === 0 ? (
        <p className={styles.empty}>READING THE POPULATION…</p>
      ) : visible.length === 0 ? (
        <p className={styles.empty}>NO CREATURES MATCH THAT FILTER.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((c) => (
            <CreatureCard key={c.id} creature={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CreatureExplorer;
