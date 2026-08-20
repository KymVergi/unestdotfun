import type { ReactNode } from 'react';
import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import PixelEgg from '@/components/pixel/PixelEgg/PixelEgg';
import EnergyBar from '@/components/pixel/EnergyBar/EnergyBar';
import { effectiveWeight, rarityOf } from '@/config/protocol';
import { eggLabel } from '@/lib/utils/format';
import type { Creature } from '@/lib/data/creatures';
import styles from './CreatureCard.module.css';

export interface CreatureCardProps {
  creature: Creature;
  /** Extra rows rendered under the stats — used by the Nest dashboard. */
  actions?: ReactNode;
  showTraits?: boolean;
  className?: string;
}

export function CreatureCard({
  creature,
  actions,
  showTraits = false,
  className,
}: CreatureCardProps) {
  const rarity = rarityOf(creature.rarity);
  const eff = creature.isSealed ? 0 : effectiveWeight(creature.rewardWeight, creature.energy);

  return (
    <article
      className={[styles.card, creature.isSealed ? styles.sealed : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--rarity': rarity.color } as React.CSSProperties}
    >
      <header className={styles.head}>
        <span className={styles.id}>{eggLabel(creature.id)}</span>
        <span className={styles.rarity}>{creature.isSealed ? 'SEALED' : rarity.label}</span>
      </header>

      <div className={styles.art}>
        <span className={styles.artBg} aria-hidden="true" />
        {creature.isSealed ? (
          <PixelEgg
            id={creature.id}
            crack={creature.blocksToReveal <= 2 ? 1 : 0}
            spriteClassName={styles.wobble}
            title={`Sealed EGG #${creature.id}`}
            className={styles.sprite}
          />
        ) : (
          <PixelCreature id={creature.id} dna={creature.dna} className={styles.sprite} />
        )}

        {creature.isSealed ? (
          <span className={styles.blocks}>
            BLOCK {creature.blocksToReveal > 0 ? creature.blocksToReveal : 'READY'}
          </span>
        ) : null}
      </div>

      {creature.isSealed ? (
        <p className={styles.sealedNote}>
          Traits are hidden until the reveal target is fixed. Hatch to make the creature permanent.
        </p>
      ) : (
        <>
          <EnergyBar energy={creature.energy} compact />

          <dl className={styles.stats}>
            <div>
              <dt>WEIGHT</dt>
              <dd>{creature.rewardWeight}</dd>
            </div>
            <div>
              <dt>EFFECTIVE</dt>
              <dd className={styles.eff}>{eff}</dd>
            </div>
            <div>
              <dt>GEN</dt>
              <dd>{creature.generation}</dd>
            </div>
            <div>
              <dt>TRAITS</dt>
              <dd>{creature.traitCount}</dd>
            </div>
            <div>
              <dt>BREEDS</dt>
              <dd>{creature.breedCount}</dd>
            </div>
            <div>
              <dt>EVOLVES</dt>
              <dd>{creature.evolutionCount}</dd>
            </div>
          </dl>

          {showTraits ? (
            <ul className={styles.traits}>
              {Object.entries(creature.traits)
                .filter(([, v]) => v !== 'NONE')
                .map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <b>{v}</b>
                  </li>
                ))}
            </ul>
          ) : null}
        </>
      )}

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </article>
  );
}

export default CreatureCard;
