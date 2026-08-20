import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import EnergyBar from '@/components/pixel/EnergyBar/EnergyBar';
import {
  ENERGY_DECAY,
  ENERGY_DECAY_PERIOD_HOURS,
  FEED_AMOUNT,
  FEED_COST,
  MAX_ENERGY,
} from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './EnergyLadder.module.css';

const RUNGS = [
  { energy: 100, label: 'HAPPY', id: 3, note: 'Full effective weight.' },
  { energy: 75, label: 'ACTIVE', id: 11, note: 'Producing normally.' },
  { energy: 50, label: 'HUNGRY', id: 26, note: 'Half the effective weight.' },
  { energy: 25, label: 'WEAK', id: 34, note: 'One step from sleeping.' },
  { energy: 0, label: 'HIBERNATING', id: 45, note: 'No rewards until fed.' },
] as const;

export function EnergyLadder() {
  return (
    <div className={styles.wrap}>
      <ol className={styles.ladder}>
        {RUNGS.map((rung) => (
          <li
            key={rung.label}
            className={[styles.rung, rung.energy === 0 ? styles.asleep : ''].join(' ')}
          >
            <div className={styles.art}>
              <PixelCreature
                id={rung.id}
                idle={rung.energy > 0}
                className={styles.sprite}
                title={`Creature at ${rung.energy} energy`}
              />
              {rung.energy === 0 ? (
                <span className={styles.zzz} aria-hidden="true">
                  z
                </span>
              ) : null}
            </div>

            <span className={styles.value}>{rung.energy}</span>
            <span className={styles.label}>{rung.label}</span>
            <EnergyBar energy={rung.energy} showLabel={false} segments={8} compact />
            <span className={styles.note}>{rung.note}</span>
          </li>
        ))}
      </ol>

      <div className={styles.mechanics}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>DECAY</span>
          <span className={styles.cardValue}>
            −{ENERGY_DECAY} / ~{ENERGY_DECAY_PERIOD_HOURS}H
          </span>
          <span className={styles.cardNote}>
            Every creature starts at {MAX_ENERGY} Energy on hatch and loses {ENERGY_DECAY} per day.
            Left alone it reaches 0 and hibernates.
          </span>
        </div>

        <div className={[styles.card, styles.feed].join(' ')}>
          <span className={styles.cardTitle}>FEED</span>
          <span className={styles.cardValue}>{compact(FEED_COST)} $UNEST</span>
          <span className={styles.cardNote}>
            Burns fuel, restores +{FEED_AMOUNT} Energy, capped at {MAX_ENERGY}. A hibernating
            creature wakes up the moment it is fed.
          </span>
          <span className={styles.feedFx} aria-hidden="true">
            <i />
            <i style={{ animationDelay: '0.4s' }} />
            <i style={{ animationDelay: '0.85s' }} />
          </span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardTitle}>CONSEQUENCE</span>
          <span className={styles.cardValue}>0 ENERGY = 0 REWARDS</span>
          <span className={styles.cardNote}>
            Hibernating creatures stop generating rewards entirely. They are not burned and they are
            not lost — they are just asleep.
          </span>
        </div>
      </div>
    </div>
  );
}

export default EnergyLadder;
