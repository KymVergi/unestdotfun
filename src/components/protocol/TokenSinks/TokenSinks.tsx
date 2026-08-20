import Icon from '@/components/pixel/Icon/Icon';
import Furnace from '@/components/farm/Furnace/Furnace';
import { TOKEN_SINKS } from '@/config/protocol';
import styles from './TokenSinks.module.css';

export function TokenSinks() {
  return (
    <div className={styles.wrap}>
      <div className={styles.furnaceCol}>
        <Furnace intensity="hot" label="The furnace consuming $UNEST" />
        <span className={styles.furnaceLabel}>THE FURNACE</span>
        <p className={styles.furnaceNote}>
          Every action on the Farm costs fuel. Fuel that is spent does not come back.
        </p>
      </div>

      <ul className={styles.grid}>
        {TOKEN_SINKS.map((sink) => (
          <li key={sink.id} className={styles.sink}>
            <div className={styles.sinkHead}>
              <span className={styles.sinkName}>{sink.label}</span>
              {sink.burns ? (
                <span className={styles.burnTag} title="Removes supply">
                  <Icon name="flame" size={10} />
                  BURN
                </span>
              ) : null}
            </div>
            <span className={styles.amount}>{sink.amount}</span>
            <span className={styles.detail}>{sink.detail}</span>
            <span className={styles.ember} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TokenSinks;
