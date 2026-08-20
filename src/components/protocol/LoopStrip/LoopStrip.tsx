import { compact } from '@/lib/utils/format';
import { FEED_COST, HATCH_COST, MINT_UNIT } from '@/config/protocol';
import styles from './LoopStrip.module.css';

const STEPS = [
  {
    n: '01',
    title: 'BUY',
    body: `Buy $UNEST from the official pool.`,
    tag: `${compact(MINT_UNIT)} = 1 EGG`,
  },
  { n: '02', title: 'EGG', body: 'A Sealed EGG lands in your wallet.', tag: 'TRAITS HIDDEN' },
  {
    n: '03',
    title: 'HATCH',
    body: 'Burn fuel and crack it open.',
    tag: `${compact(HATCH_COST)} $UNEST`,
  },
  {
    n: '04',
    title: 'FEED',
    body: 'Energy decays. Keep the creature awake.',
    tag: `${compact(FEED_COST)} $UNEST`,
  },
  { n: '05', title: 'EARN', body: 'Active creatures share the pool fees.', tag: '90% OF FEES' },
] as const;

/** The fifteen-second explanation. */
export function LoopStrip() {
  return (
    <ol className={styles.strip}>
      {STEPS.map((s, i) => (
        <li key={s.n} className={styles.step} style={{ animationDelay: `${i * 0.12}s` }}>
          <span className={styles.n}>{s.n}</span>
          <h3 className={styles.title}>{s.title}</h3>
          <p className={styles.body}>{s.body}</p>
          <span className={styles.tag}>{s.tag}</span>
          {i < STEPS.length - 1 ? (
            <span className={styles.arrow} aria-hidden="true">
              ▸
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default LoopStrip;
