'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/pixel/Icon/Icon';
import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import EnergyBar from '@/components/pixel/EnergyBar/EnergyBar';
import TxButton from '@/components/web3/TxButton/TxButton';
import { PixelButton } from '@/components/pixel/PixelButton/PixelButton';
import { BREEDING_ENGINE_ADDRESS, NOT_CONFIGURED_LABEL } from '@/config/contracts';
import { BREED_COOLDOWN, BREED_COST, rarityOf } from '@/config/protocol';
import { breedingEngineAbi } from '@/lib/web3/abis';
import { eligiblePartners, type Creature } from '@/lib/protocol/creature';
import { useNowSeconds } from '@/lib/hooks/useNowSeconds';
import { compact, eggLabel } from '@/lib/utils/format';
import styles from './BreedDialog.module.css';

export interface BreedDialogProps {
  self: Creature;
  all: Creature[];
  onClose: () => void;
  onBred?: () => void;
}

/** Picks the second parent. Breeding needs two real token ids, not one twice. */
export function BreedDialog({ self, all, onClose, onBred }: BreedDialogProps) {
  const now = useNowSeconds();
  const partners = eligiblePartners(all, self, now);
  const [partnerId, setPartnerId] = useState<number | null>(partners[0]?.id ?? null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const partner = partners.find((p) => p.id === partnerId) ?? null;

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Choose a breeding partner"
    >
      <div className={styles.panel}>
        <header className={styles.head}>
          <h2 className={styles.title}>BREEDING BARN</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <Icon name="close" size={14} />
          </button>
        </header>

        <div className={styles.pair}>
          <figure className={styles.slot}>
            <PixelCreature id={self.id} dna={self.dna} className={styles.sprite} />
            <figcaption>{eggLabel(self.id)}</figcaption>
            <span className={styles.slotMeta}>{rarityOf(self.rarity).label}</span>
            <EnergyBar energy={self.energy} showLabel={false} segments={6} compact />
          </figure>

          <span className={styles.plus} aria-hidden="true">
            <Icon name="plus" size={16} />
          </span>

          <figure className={[styles.slot, partner ? '' : styles.slotEmpty].join(' ')}>
            {partner ? (
              <>
                <PixelCreature id={partner.id} dna={partner.dna} className={styles.sprite} />
                <figcaption>{eggLabel(partner.id)}</figcaption>
                <span className={styles.slotMeta}>{rarityOf(partner.rarity).label}</span>
                <EnergyBar energy={partner.energy} showLabel={false} segments={6} compact />
              </>
            ) : (
              <span className={styles.slotEmptyText}>NO ELIGIBLE PARTNER</span>
            )}
          </figure>
        </div>

        {partners.length > 0 ? (
          <>
            <span className={styles.listLabel}>CHOOSE THE SECOND PARENT</span>
            <ul className={styles.list}>
              {partners.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={[styles.option, p.id === partnerId ? styles.optionOn : ''].join(' ')}
                    onClick={() => setPartnerId(p.id)}
                    aria-pressed={p.id === partnerId}
                  >
                    <PixelCreature id={p.id} dna={p.dna} idle={false} className={styles.thumb} />
                    <span className={styles.optId}>{eggLabel(p.id)}</span>
                    <span className={styles.optRarity} style={{ color: rarityOf(p.rarity).color }}>
                      {rarityOf(p.rarity).label}
                    </span>
                    <span className={styles.optEnergy}>E {p.energy}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className={styles.empty}>
            Breeding needs two creatures with Energy above zero and no active cooldown. Feed another
            creature in your Nest and come back.
          </p>
        )}

        <dl className={styles.terms}>
          <div>
            <dt>COST</dt>
            <dd>{compact(BREED_COST)} $UNEST · BURNED</dd>
          </div>
          <div>
            <dt>COOLDOWN</dt>
            <dd>{BREED_COOLDOWN} DAYS ON BOTH PARENTS</dd>
          </div>
          <div>
            <dt>RESULT</dt>
            <dd>ONE NEW SEALED EGG</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <TxButton
            label="BREED"
            variant="primary"
            cost={`${compact(BREED_COST)} $UNEST`}
            spendAmount={BREED_COST}
            address={BREEDING_ENGINE_ADDRESS}
            abi={breedingEngineAbi}
            functionName="breed"
            args={partner ? [BigInt(self.id), BigInt(partner.id)] : []}
            blockedReason={
              !partner
                ? 'NO PARTNER SELECTED'
                : BREEDING_ENGINE_ADDRESS
                  ? undefined
                  : NOT_CONFIGURED_LABEL
            }
            onConfirmed={() => {
              onBred?.();
              onClose();
            }}
          />
          <PixelButton size="sm" variant="ghost" onClick={onClose}>
            CANCEL
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

export default BreedDialog;
