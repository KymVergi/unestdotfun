import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import PixelEgg from '@/components/pixel/PixelEgg/PixelEgg';
import {
  BREED_COOLDOWN,
  BREED_COST,
  BREED_PARENT_ROYALTY_PCT,
  BREED_ROYALTY_DAYS,
  BREED_WEIGHT_BONUS_MAX,
  BREED_WEIGHT_BONUS_MIN,
} from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './BreedingPanel.module.css';

export function BreedingPanel() {
  return (
    <div className={styles.wrap}>
      <div className={styles.barn}>
        <svg
          className={styles.barnArt}
          viewBox="0 0 120 60"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }, (_, i) => {
            const w = 24 + i * 9;
            return (
              <rect
                key={i}
                x={Math.round(60 - w / 2)}
                y={i * 2}
                width={w}
                height={2}
                fill={i % 2 === 0 ? '#7c3427' : '#8f3c2e'}
              />
            );
          })}
          <rect x={22} y={16} width={76} height={44} fill="#a94a38" />
          <rect x={22} y={16} width={76} height={2} fill="#c05a45" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={24 + i * 9} y={18} width={1} height={42} fill="#8f3c2e" />
          ))}
          <rect x={46} y={30} width={28} height={30} fill="#3a2214" />
          <rect x={48} y={32} width={24} height={28} fill="#70452a" />
          <rect x={59} y={32} width={2} height={28} fill="#3a2214" />
          <rect x={52} y={20} width={16} height={8} fill="#3a2214" />
          <rect x={54} y={22} width={12} height={4} fill="#f4c95d" />
        </svg>
        <span className={styles.barnLabel}>BREEDING BARN</span>
      </div>

      <div className={styles.flow}>
        <div className={styles.parents}>
          <figure className={styles.parent}>
            <PixelCreature id={5} className={styles.sprite} />
            <figcaption>CREATURE A</figcaption>
            <span className={styles.req}>ENERGY &gt; 0</span>
          </figure>

          <span className={styles.plus} aria-hidden="true">
            +
          </span>

          <figure className={styles.parent}>
            <PixelCreature id={31} className={styles.sprite} />
            <figcaption>CREATURE B</figcaption>
            <span className={styles.req}>ENERGY &gt; 0</span>
          </figure>
        </div>

        <div className={styles.cost}>
          <span className={styles.costValue}>{compact(BREED_COST)} $UNEST</span>
          <span className={styles.costLabel}>BURNED</span>
          <span className={styles.cooldown}>COOLDOWN {BREED_COOLDOWN} DAYS</span>
        </div>

        <div className={styles.child}>
          <PixelEgg id={104} spriteClassName={styles.childEgg} className={styles.sprite} />
          <span className={styles.childLabel}>NEW SEALED EGG</span>
        </div>
      </div>

      <ul className={styles.rules}>
        <li>
          <span>INHERITS</span>
          <b>Traits from both parents</b>
        </li>
        <li>
          <span>MAY RECEIVE</span>
          <b>Mutations</b>
        </li>
        <li>
          <span>WEIGHT</span>
          <b>
            +{BREED_WEIGHT_BONUS_MIN}–{BREED_WEIGHT_BONUS_MAX} Reward Weight
          </b>
        </li>
        <li>
          <span>GENERATION</span>
          <b>Parent generation + 1</b>
        </li>
        <li className={styles.royalty}>
          <span>PARENT ROYALTY</span>
          <b>
            {BREED_PARENT_ROYALTY_PCT}% each, from the child&apos;s rewards, for{' '}
            {BREED_ROYALTY_DAYS} days
          </b>
        </li>
      </ul>
    </div>
  );
}

export default BreedingPanel;
