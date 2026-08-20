import LiveEggCount from '@/components/web3/LiveEggCount/LiveEggCount';
import { MINT_UNIT, THEORETICAL_MAX_EGGS, UNEST_SUPPLY } from '@/config/protocol';
import { compact, grouped } from '@/lib/utils/format';
import styles from './Scarcity.module.css';

export function Scarcity() {
  return (
    <div className={styles.wrap}>
      <div className={styles.mathCol}>
        <div className={styles.math}>
          <div className={styles.mathRow}>
            <span className={styles.mathValue}>{grouped(UNEST_SUPPLY)}</span>
            <span className={styles.mathLabel}>$UNEST SUPPLY</span>
          </div>
          <span className={styles.op}>÷</span>
          <div className={styles.mathRow}>
            <span className={styles.mathValue}>{grouped(MINT_UNIT)}</span>
            <span className={styles.mathLabel}>MINT UNIT</span>
          </div>
          <span className={styles.op}>=</span>
          <div className={[styles.mathRow, styles.result].join(' ')}>
            <span className={styles.mathValue}>{grouped(THEORETICAL_MAX_EGGS)}</span>
            <span className={styles.mathLabel}>THEORETICAL EGGS</span>
          </div>
        </div>

        <p className={styles.explain}>
          {grouped(THEORETICAL_MAX_EGGS)} is a ceiling, not a supply. It is what the token math
          allows if not a single $UNEST were ever consumed — and $UNEST is consumed constantly.
          Hatching burns. Feeding burns. Breeding burns. Evolution burns. Buyback burns. Every burn
          lowers the ceiling.
        </p>
      </div>

      <div className={styles.counters}>
        <div className={styles.counter}>
          <span className={styles.counterValue}>{grouped(THEORETICAL_MAX_EGGS)}</span>
          <span className={styles.counterLabel}>THEORETICAL MAX</span>
          <span className={styles.counterState}>FIXED BY TOKEN MATH</span>
        </div>

        <LiveEggCount className={styles.counterLive} />

        <p className={styles.footnote}>
          {compact(MINT_UNIT)} $UNEST of wallet backing is required per EGG. The $UNEST is never
          locked — it stays liquid in the wallet — but the balance decides how many EGGs that wallet
          can support.
        </p>
      </div>
    </div>
  );
}

export default Scarcity;
