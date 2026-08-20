import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import { DEMO_BLOODLINE } from '@/lib/data/creatures';
import { padId } from '@/lib/utils/format';
import styles from './Bloodline.module.css';

/** A pixel-RPG family tree. GEN 0 founders at the top, descendants below. */
export function Bloodline() {
  const gen0 = DEMO_BLOODLINE.filter((n) => n.generation === 0);
  const rest = DEMO_BLOODLINE.filter((n) => n.generation > 0);

  return (
    <div className={styles.tree}>
      <div className={styles.genRow}>
        <span className={styles.genTag}>GEN 0</span>
        <div className={styles.founders}>
          {gen0.map((n, i) => (
            <div key={n.id} className={styles.nodeWrap}>
              <article className={styles.node}>
                <PixelCreature id={n.id} className={styles.sprite} />
                <span className={styles.nodeId}>CREATURE #{padId(n.id)}</span>
                <span className={styles.nodeMeta}>FOUNDER</span>
              </article>
              {i === 0 ? (
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {rest.map((n) => (
        <div key={n.id} className={styles.genRow}>
          <span className={styles.connector} aria-hidden="true" />
          <span className={styles.genTag}>GEN {n.generation}</span>

          <article className={[styles.node, styles.child].join(' ')}>
            <PixelCreature id={n.id} className={styles.sprite} />
            <span className={styles.nodeId}>CREATURE #{padId(n.id)}</span>
            <dl className={styles.detail}>
              <div>
                <dt>PARENT 1</dt>
                <dd>#{padId(n.parents?.[0] ?? 0)}</dd>
              </div>
              <div>
                <dt>PARENT 2</dt>
                <dd>#{padId(n.parents?.[1] ?? 0)}</dd>
              </div>
              <div>
                <dt>INHERITED</dt>
                <dd>{n.inherited.join(' · ')}</dd>
              </div>
              <div>
                <dt>MUTATION</dt>
                <dd className={n.mutation === 'NONE' ? '' : styles.mutated}>{n.mutation}</dd>
              </div>
            </dl>
          </article>
        </div>
      ))}
    </div>
  );
}

export default Bloodline;
