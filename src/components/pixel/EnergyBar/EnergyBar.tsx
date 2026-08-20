import { MAX_ENERGY, energyState } from '@/config/protocol';
import styles from './EnergyBar.module.css';

export interface EnergyBarProps {
  energy: number;
  /** Number of pixel segments in the bar. */
  segments?: number;
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

export function EnergyBar({
  energy,
  segments = 10,
  showLabel = true,
  compact = false,
  className,
}: EnergyBarProps) {
  const clamped = Math.max(0, Math.min(MAX_ENERGY, energy));
  const state = energyState(clamped);
  const filled = Math.round((clamped / MAX_ENERGY) * segments);

  return (
    <div
      className={[styles.wrap, compact ? styles.compact : '', className].filter(Boolean).join(' ')}
    >
      {showLabel ? (
        <div className={styles.top}>
          <span className={styles.name}>ENERGY</span>
          <span className={styles.reading}>
            {clamped} / {MAX_ENERGY}
          </span>
        </div>
      ) : null}

      <div
        className={styles.track}
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={MAX_ENERGY}
        aria-label="Creature energy"
        style={{ '--fill': state.color } as React.CSSProperties}
      >
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className={[styles.cell, i < filled ? styles.on : ''].join(' ')} />
        ))}
      </div>

      {showLabel ? (
        <span className={styles.state} style={{ color: state.color }}>
          {state.label}
        </span>
      ) : null}
    </div>
  );
}

export default EnergyBar;
