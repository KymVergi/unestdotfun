'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { buildEgg } from '@/lib/pixel/egg';
import { buildCreature } from '@/lib/pixel/creature';
import PixelGrid from '@/components/pixel/PixelGrid/PixelGrid';
import styles from './HeroEgg.module.css';

/**
 * The centrepiece: a large pixel EGG resting in its nest.
 * Idle it wobbles. On hover a crack opens and something moves inside.
 */
export function HeroEgg() {
  const [awake, setAwake] = useState(false);
  const reduce = useReducedMotion();

  const calm = buildEgg({ id: 1, golden: true });
  const cracked = buildEgg({ id: 1, golden: true, crack: 2 });
  const inhabitant = buildCreature(777);

  const shown = awake ? cracked : calm;

  return (
    <div
      className={styles.stage}
      onMouseEnter={() => setAwake(true)}
      onMouseLeave={() => setAwake(false)}
      onFocus={() => setAwake(true)}
      onBlur={() => setAwake(false)}
      tabIndex={0}
      role="img"
      aria-label="A large golden EGG resting in a nest. Something is growing inside."
    >
      <span className={styles.halo} aria-hidden="true" />

      <motion.div
        className={styles.eggHolder}
        animate={
          reduce
            ? undefined
            : awake
              ? { rotate: [0, -4, 3.5, -2.5, 1.5, 0], y: [0, -3, 0, -2, 0] }
              : { rotate: 0, y: 0 }
        }
        transition={{ duration: 0.7, repeat: awake ? Infinity : 0, ease: 'linear' }}
      >
        {/* the silhouette lives behind the shell and peeks through the crack */}
        <span
          className={[styles.inside, awake ? styles.insideOn : ''].join(' ')}
          aria-hidden="true"
        >
          <PixelGrid
            grid={inhabitant.grid}
            palette={{ ...inhabitant.palette, o: '#11130f' }}
            pad={1}
          />
        </span>

        <span className={styles.shell}>
          <PixelGrid grid={shown.grid} palette={shown.palette} pad={1} />
        </span>
      </motion.div>

      {/* nest */}
      <svg
        className={styles.nest}
        viewBox="0 0 60 16"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <rect x={4} y={4} width={52} height={5} fill="#8b5f1c" />
        <rect x={2} y={7} width={56} height={4} fill="#70452a" />
        <rect x={0} y={10} width={60} height={4} fill="#4b2d1b" />
        <rect x={8} y={2} width={7} height={2} fill="#a8762a" />
        <rect x={22} y={1} width={9} height={2} fill="#a8762a" />
        <rect x={40} y={2} width={8} height={2} fill="#a8762a" />
        <rect x={14} y={12} width={10} height={2} fill="#3a2214" />
        <rect x={36} y={12} width={12} height={2} fill="#3a2214" />
      </svg>

      {/* drifting motes */}
      <span className={styles.particles} aria-hidden="true">
        {[12, 28, 44, 62, 78, 88].map((left, i) => (
          <i key={left} style={{ left: `${left}%`, animationDelay: `${i * 0.85}s` }} />
        ))}
      </span>

      <span className={[styles.tooltip, awake ? styles.tooltipOn : ''].join(' ')} role="status">
        SOMETHING IS GROWING INSIDE.
      </span>
    </div>
  );
}

export default HeroEgg;
