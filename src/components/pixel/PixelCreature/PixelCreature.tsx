import { buildCreature } from '@/lib/pixel/creature';
import type { CreatureDNA } from '@/lib/pixel/dna';
import PixelGrid from '../PixelGrid/PixelGrid';
import styles from './PixelCreature.module.css';

export interface PixelCreatureProps {
  id: number;
  dna?: CreatureDNA;
  className?: string;
  /** Gentle idle bob. Disabled automatically under prefers-reduced-motion. */
  idle?: boolean;
  title?: string;
  pad?: number;
}

export function PixelCreature({
  id,
  dna,
  className,
  idle = true,
  title,
  pad = 1,
}: PixelCreatureProps) {
  const { grid, palette, dna: resolved } = buildCreature(id, dna);
  const glow = resolved.glow;

  return (
    <div className={[styles.wrap, glow ? styles.glow : '', className].filter(Boolean).join(' ')}>
      <PixelGrid
        grid={grid}
        palette={palette}
        pad={pad}
        spriteClassName={idle ? styles.idle : undefined}
        title={title ?? `Creature #${String(id).padStart(3, '0')}`}
      />
    </div>
  );
}

export default PixelCreature;
