'use client';

import { useEffect, useState } from 'react';
import PixelEgg from '@/components/pixel/PixelEgg/PixelEgg';
import { SEALED_REVEAL_BLOCKS } from '@/config/protocol';
import styles from './Incubation.module.css';

/**
 * A Sealed EGG counting down to the block where its reveal target is fixed.
 * The countdown is illustrative: it demonstrates the mechanic, it does not
 * read any chain state.
 */
export function Incubation() {
  const [block, setBlock] = useState(SEALED_REVEAL_BLOCKS);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    const timer = window.setInterval(() => {
      setBlock((b) => (b <= 0 ? SEALED_REVEAL_BLOCKS : b - 1));
    }, 1100);
    return () => window.clearInterval(timer);
  }, []);

  const ready = block <= 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.incubator}>
        <span className={styles.glass} aria-hidden="true" />
        <PixelEgg
          id={9}
          crack={ready ? 1 : 0}
          spriteClassName={styles.egg}
          className={styles.eggBox}
          title="A Sealed EGG incubating"
        />
        <span className={styles.base} aria-hidden="true">
          <svg viewBox="0 0 48 12" shapeRendering="crispEdges">
            <rect x={0} y={4} width={48} height={4} fill="#4b2d1b" />
            <rect x={2} y={2} width={44} height={2} fill="#70452a" />
            <rect x={0} y={8} width={48} height={4} fill="#3a2214" />
            <rect x={6} y={5} width={4} height={2} fill="#f4c95d" className={styles.led} />
            <rect x={38} y={5} width={4} height={2} fill="#5c8a3d" />
          </svg>
        </span>
      </div>

      <div className={styles.readout} aria-live="polite">
        <span className={styles.readLabel}>REVEAL TARGET</span>
        <span className={[styles.readValue, ready ? styles.readReady : ''].join(' ')}>
          {ready ? 'FIXED' : `BLOCK ${block}`}
        </span>
        <span className={styles.readNote}>
          {ready
            ? 'Traits are now committed. The EGG can be hatched.'
            : `~${SEALED_REVEAL_BLOCKS} blocks after mint the reveal target becomes fixed.`}
        </span>

        <div className={styles.ticks} aria-hidden="true">
          {Array.from({ length: SEALED_REVEAL_BLOCKS + 1 }, (_, i) => (
            <span
              key={i}
              className={[styles.tick, SEALED_REVEAL_BLOCKS - i >= block ? styles.tickOn : ''].join(
                ' ',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Incubation;
