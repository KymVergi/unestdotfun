import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import {
  EVOLUTION_COST,
  EVOLUTION_FAIL_RATE,
  EVOLUTION_MIN_ENERGY,
  EVOLUTION_SUCCESS_RATE,
} from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './EvolutionPanel.module.css';

export function EvolutionPanel() {
  return (
    <div className={styles.wrap}>
      <div className={styles.chamber}>
        <span className={styles.beam} aria-hidden="true" />
        <div className={styles.before}>
          <PixelCreature id={19} className={styles.sprite} />
          <span className={styles.stateLabel}>BEFORE</span>
        </div>
        <span className={styles.arrow} aria-hidden="true">
          ▸
        </span>
        <div className={styles.after}>
          <PixelCreature id={919} className={styles.sprite} />
          <span className={[styles.stateLabel, styles.afterLabel].join(' ')}>AFTER</span>
          <span className={styles.sparks} aria-hidden="true">
            <i />
            <i style={{ animationDelay: '0.3s' }} />
            <i style={{ animationDelay: '0.65s' }} />
            <i style={{ animationDelay: '0.95s' }} />
          </span>
        </div>
      </div>

      <div className={styles.odds}>
        <div className={styles.oddsBar} role="img" aria-label="70% upgrade, 30% no change">
          <span className={styles.win} style={{ flexGrow: EVOLUTION_SUCCESS_RATE }}>
            {EVOLUTION_SUCCESS_RATE}%
          </span>
          <span className={styles.lose} style={{ flexGrow: EVOLUTION_FAIL_RATE }}>
            {EVOLUTION_FAIL_RATE}%
          </span>
        </div>
        <div className={styles.oddsLegend}>
          <span className={styles.legendWin}>UPGRADE</span>
          <span className={styles.legendLose}>NO CHANGE</span>
        </div>
      </div>

      <dl className={styles.spec}>
        <div>
          <dt>REQUIREMENT</dt>
          <dd>ENERGY ≥ {EVOLUTION_MIN_ENERGY}</dd>
        </div>
        <div>
          <dt>COST</dt>
          <dd>{compact(EVOLUTION_COST)} $UNEST · BURNED</dd>
        </div>
        <div>
          <dt>ON SUCCESS</dt>
          <dd>May improve traits, rarity and Reward Weight</dd>
        </div>
        <div>
          <dt>ON FAILURE</dt>
          <dd>Nothing changes. Reward Weight is not reduced.</dd>
        </div>
      </dl>

      <p className={styles.warning}>
        The fuel is spent either way. A failed evolution costs {compact(EVOLUTION_COST)} $UNEST and
        returns nothing but the creature you already had.
      </p>
    </div>
  );
}

export default EvolutionPanel;
