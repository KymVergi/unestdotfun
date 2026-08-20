'use client';

import { useState } from 'react';
import Furnace from '@/components/farm/Furnace/Furnace';
import { BACKING_PER_EGG, supportedEggs } from '@/config/protocol';
import { compact, grouped } from '@/lib/utils/format';
import styles from './BackingPanel.module.css';

const HELD_EGGS = 10;
const MAX_BALANCE = BACKING_PER_EGG * 12;

/**
 * Continuous backing, made tangible: move the balance and watch how many EGGs
 * the wallet can still support. The $UNEST is never locked — it just has to be
 * there.
 */
export function BackingPanel() {
  const [balance, setBalance] = useState(BACKING_PER_EGG * HELD_EGGS);

  const supported = Math.min(HELD_EGGS, supportedEggs(balance));
  const burned = HELD_EGGS - supported;

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.label} htmlFor="backing-balance">
          WALLET $UNEST BALANCE
        </label>
        <output className={styles.balance} htmlFor="backing-balance">
          {grouped(balance)}
        </output>
        <input
          id="backing-balance"
          className={styles.slider}
          type="range"
          min={0}
          max={MAX_BALANCE}
          step={BACKING_PER_EGG / 2}
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
        />
        <div className={styles.scale} aria-hidden="true">
          <span>0</span>
          <span>{compact(MAX_BALANCE / 2)}</span>
          <span>{compact(MAX_BALANCE)}</span>
        </div>
        <p className={styles.rule}>
          {compact(BACKING_PER_EGG)} $UNEST of backing per EGG. Not locked, not staked, not
          transferred — it simply has to remain in the wallet.
        </p>
      </div>

      <div className={styles.result}>
        <div className={styles.counts}>
          <div className={styles.count}>
            <span className={styles.countValue}>{HELD_EGGS}</span>
            <span className={styles.countLabel}>EGGS HELD</span>
          </div>
          <div className={[styles.count, styles.ok].join(' ')}>
            <span className={styles.countValue}>{supported}</span>
            <span className={styles.countLabel}>SUPPORTED</span>
          </div>
          <div className={[styles.count, burned > 0 ? styles.bad : ''].join(' ')}>
            <span className={styles.countValue}>{burned}</span>
            <span className={styles.countLabel}>BURNED</span>
          </div>
        </div>

        <div className={styles.eggs} aria-hidden="true">
          {Array.from({ length: HELD_EGGS }, (_, i) => (
            <span key={i} className={[styles.egg, i >= supported ? styles.eggBurn : ''].join(' ')}>
              <svg viewBox="0 0 8 10" shapeRendering="crispEdges">
                <rect x={3} y={0} width={2} height={1} fill="currentColor" />
                <rect x={2} y={1} width={4} height={1} fill="currentColor" />
                <rect x={1} y={2} width={6} height={6} fill="currentColor" />
                <rect x={2} y={8} width={4} height={1} fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>

        <div className={styles.furnaceRow}>
          <Furnace
            intensity={burned > 0 ? 'hot' : 'idle'}
            label="Furnace burning unsupported EGGs"
          />
          <p className={styles.verdict}>
            {burned > 0 ? (
              <>
                <b className={styles.bad}>UNDER-BACKED.</b> {burned} EGG{burned > 1 ? 's' : ''} can
                no longer be supported by this balance and {burned > 1 ? 'are' : 'is'} burned
                according to protocol rules.
              </>
            ) : (
              <>
                <b className={styles.ok}>FULLY BACKED.</b> Every EGG in the wallet has its{' '}
                {compact(BACKING_PER_EGG)} $UNEST behind it.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BackingPanel;
