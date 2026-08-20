import { REWARD_DISTRIBUTION } from '@/config/protocol';
import styles from './RewardSplit.module.css';

export interface RewardSplitProps {
  /** Adds the animated fee-flow rail used on the Hooks page. */
  flow?: boolean;
  className?: string;
}

export function RewardSplit({ flow = false, className }: RewardSplitProps) {
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <div className={styles.bar} role="img" aria-label="Pool fee distribution: 90/5/3/2">
        {REWARD_DISTRIBUTION.map((slice) => (
          <span
            key={slice.id}
            className={styles.seg}
            style={{ flexGrow: slice.pct, background: slice.color }}
          >
            <span className={styles.segPct}>{slice.pct}%</span>
          </span>
        ))}
      </div>

      {flow ? (
        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railLabel}>POOL FEES</span>
          <span className={styles.railTrack}>
            <i />
            <i style={{ animationDelay: '0.7s' }} />
            <i style={{ animationDelay: '1.4s' }} />
          </span>
          <span className={styles.railLabel}>FEE HOOK</span>
        </div>
      ) : null}

      <ul className={styles.legend}>
        {REWARD_DISTRIBUTION.map((slice) => (
          <li key={slice.id} className={styles.item}>
            <span
              className={styles.swatch}
              style={{ background: slice.color }}
              aria-hidden="true"
            />
            <span className={styles.pct}>{slice.pct}%</span>
            <span className={styles.label}>{slice.label}</span>
            <span className={styles.desc}>{slice.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RewardSplit;
