'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { buildEgg } from '@/lib/pixel/egg';
import { buildCreature } from '@/lib/pixel/creature';
import PixelGrid from '@/components/pixel/PixelGrid/PixelGrid';
import { PixelButton } from '@/components/pixel/PixelButton/PixelButton';
import { HATCH_COST, HATCH_TRAIT_MAX, HATCH_TRAIT_MIN } from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './HatchSequence.module.css';

const STAGES = [
  { key: 0, caption: 'SEALED. NOTHING IS DECIDED YET.' },
  { key: 1, caption: 'A HAIRLINE APPEARS.' },
  { key: 2, caption: 'THE SHELL GIVES WAY.' },
  { key: 3, caption: 'IT IS COMING OUT.' },
  { key: 4, caption: 'PERMANENT. TRAITS ARE WRITTEN.' },
] as const;

const DEMO_ID = 314;

export function HatchSequence() {
  const [stage, setStage] = useState(0);
  const reduce = useReducedMotion();

  const shells = useMemo(
    () => [
      buildEgg({ id: DEMO_ID }),
      buildEgg({ id: DEMO_ID, crack: 1 }),
      buildEgg({ id: DEMO_ID, crack: 2 }),
      buildEgg({ id: DEMO_ID, crack: 3, open: true }),
    ],
    [],
  );
  const creature = useMemo(() => buildCreature(DEMO_ID), []);

  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(
      () => setStage((s) => (s + 1) % STAGES.length),
      stage === 4 ? 2600 : 1500,
    );
    return () => window.clearTimeout(t);
  }, [stage, reduce]);

  const hatched = stage === 4;

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <span
          className={[styles.flash, stage === 3 ? styles.flashOn : ''].join(' ')}
          aria-hidden="true"
        />

        <AnimatePresence mode="wait">
          {hatched ? (
            <motion.div
              key="creature"
              className={styles.art}
              initial={reduce ? false : { scale: 0.6, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'linear' }}
            >
              <PixelGrid
                grid={creature.grid}
                palette={creature.palette}
                pad={1}
                title="The hatched creature"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`shell-${stage}`}
              className={[styles.art, stage >= 1 ? styles.shaking : ''].join(' ')}
              initial={reduce ? false : { opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.4 }}
              transition={{ duration: 0.12 }}
            >
              <PixelGrid
                grid={shells[stage].grid}
                palette={shells[stage].palette}
                pad={1}
                title="A Sealed EGG hatching"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {stage >= 2 ? (
          <span className={styles.particles} aria-hidden="true">
            {[20, 38, 52, 68, 82].map((l, i) => (
              <i key={l} style={{ left: `${l}%`, animationDelay: `${i * 0.18}s` }} />
            ))}
          </span>
        ) : null}
      </div>

      <div className={styles.side}>
        <span className={styles.caption} aria-live="polite">
          {STAGES[stage].caption}
        </span>

        <dl className={styles.spec}>
          <div>
            <dt>COST</dt>
            <dd>{compact(HATCH_COST)} $UNEST · BURNED</dd>
          </div>
          <div>
            <dt>GENERATES</dt>
            <dd>
              {HATCH_TRAIT_MIN}–{HATCH_TRAIT_MAX} permanent traits
            </dd>
          </div>
          <div>
            <dt>ALSO SETS</dt>
            <dd>Rarity · Reward Weight · Visual DNA</dd>
          </div>
          <div>
            <dt>REVERSIBLE</dt>
            <dd className={styles.no}>NO</dd>
          </div>
        </dl>

        <div className={styles.controls}>
          {STAGES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={[styles.dot, stage === s.key ? styles.dotOn : ''].join(' ')}
              onClick={() => setStage(s.key)}
              aria-label={`Stage ${s.key + 1}`}
            />
          ))}
          <PixelButton size="sm" variant="ghost" onClick={() => setStage(0)}>
            REPLAY
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

export default HatchSequence;
