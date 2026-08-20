import styles from './HookArchitecture.module.css';

const ENGINES = [
  { label: 'MINT ENGINE', note: 'qualifying buys → Sealed EGG' },
  { label: 'FEE ENGINE', note: '90 / 5 / 3 / 2' },
  { label: 'BACKING ENGINE', note: '1 EGG ↔ 50M $UNEST' },
  { label: 'REWARD ENGINE', note: 'weight × energy' },
  { label: 'BUYBACK ENGINE', note: 'buy → burn' },
  { label: 'BREEDING ENGINE', note: 'A + B → new EGG' },
] as const;

/**
 * The architecture, drawn as a terminal tree. Deliberately plain: this is the
 * one place on the Farm where the machine should look like a machine.
 */
export function HookArchitecture() {
  return (
    <div className={styles.terminal}>
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.barText}>UNEST://architecture</span>
        <span className={styles.caret} aria-hidden="true">
          _
        </span>
      </div>

      <div className={styles.body}>
        <ol className={styles.stack}>
          <li className={styles.level}>
            <span className={styles.box}>USER</span>
          </li>
          <li className={styles.pipe} aria-hidden="true" />
          <li className={styles.level}>
            <span className={[styles.box, styles.blue].join(' ')}>ETH / $UNEST</span>
          </li>
          <li className={styles.pipe} aria-hidden="true" />
          <li className={styles.level}>
            <span className={[styles.box, styles.blue].join(' ')}>UNISWAP V4 POOL</span>
          </li>
          <li className={styles.pipe} aria-hidden="true" />
          <li className={styles.level}>
            <span className={[styles.box, styles.hook].join(' ')}>UNEST HOOK</span>
          </li>
        </ol>

        <ul className={styles.branches}>
          {ENGINES.map((e, i) => (
            <li key={e.label} className={styles.branch}>
              <span className={styles.glyph} aria-hidden="true">
                {i === ENGINES.length - 1 ? '└──' : '├──'}
              </span>
              <span className={styles.branchLabel}>{e.label}</span>
              <span className={styles.branchNote}>{e.note}</span>
            </li>
          ))}
        </ul>

        <ol className={styles.stack}>
          <li className={styles.pipe} aria-hidden="true" />
          <li className={styles.level}>
            <span className={[styles.box, styles.green].join(' ')}>EGG NFT</span>
          </li>
          <li className={styles.pipe} aria-hidden="true" />
          <li className={styles.level}>
            <span className={[styles.box, styles.yolk].join(' ')}>THE NEST</span>
          </li>
        </ol>
      </div>

      <p className={styles.legend}>
        The hook is the only component with authority over pool-level behaviour. Every engine below
        it reacts to what the pool actually did — not to what a wallet claims it did.
      </p>
    </div>
  );
}

export default HookArchitecture;
