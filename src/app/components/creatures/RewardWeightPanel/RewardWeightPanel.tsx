import { RARITIES, REWARD_WEIGHT_BASE, REWARD_WEIGHT_CAP } from '@/config/protocol';
import styles from './RewardWeightPanel.module.css';

export function RewardWeightPanel() {
  return (
    <div className={styles.wrap}>
      <div className={styles.base}>
        <span className={styles.baseLabel}>BASE WEIGHT</span>
        <span className={styles.baseValue}>{REWARD_WEIGHT_BASE}</span>
        <span className={styles.baseNote}>Every creature starts here.</span>
      </div>

      <ul className={styles.list}>
        {RARITIES.map((r) => {
          const total = REWARD_WEIGHT_BASE + r.bonus;
          const fill = (total / REWARD_WEIGHT_CAP) * 100;
          return (
            <li key={r.id} className={styles.row} style={{ '--c': r.color } as React.CSSProperties}>
              <span className={styles.name}>{r.label}</span>
              <span className={styles.bonus}>+{r.bonus}</span>
              <span className={styles.track}>
                <span className={styles.fill} style={{ width: `${fill}%` }} />
              </span>
              <span className={styles.total}>{total}</span>
            </li>
          );
        })}
      </ul>

      <div className={styles.cap}>
        <div className={styles.capRow}>
          <span className={styles.capLabel}>HARD CAP</span>
          <span className={styles.capValue}>{REWARD_WEIGHT_CAP}</span>
        </div>
        <p className={styles.capNote}>
          Breeding and Evolution can push Reward Weight above the rarity baseline, but nothing takes
          a creature past {REWARD_WEIGHT_CAP}. Weight is only half the equation — Energy decides how
          much of it actually counts.
        </p>
      </div>
    </div>
  );
}

export default RewardWeightPanel;
