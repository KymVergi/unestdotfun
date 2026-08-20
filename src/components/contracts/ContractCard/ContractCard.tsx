'use client';

import { useState } from 'react';
import Icon from '@/components/pixel/Icon/Icon';
import { NOT_CONFIGURED_LABEL, type RegistryEntry } from '@/config/contracts';
import styles from './ContractCard.module.css';

export function ContractCard({ entry }: { entry: RegistryEntry }) {
  const [copied, setCopied] = useState(false);
  const configured = entry.value.length > 0;

  async function copy() {
    if (!configured) return;
    try {
      await navigator.clipboard.writeText(entry.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className={[styles.card, configured ? '' : styles.unset].join(' ')}>
      <header className={styles.head}>
        <h3 className={styles.name}>{entry.name}</h3>
        <span className={styles.standard}>{entry.standard}</span>
      </header>

      <p className={styles.desc}>{entry.description}</p>

      <dl className={styles.meta}>
        <div>
          <dt>NETWORK</dt>
          <dd>{entry.network}</dd>
        </div>
        <div>
          <dt>{entry.valueLabel.toUpperCase()}</dt>
          <dd className={styles.value}>
            {configured ? (
              <code>{entry.value}</code>
            ) : (
              <span className={styles.placeholder}>0x… · {NOT_CONFIGURED_LABEL}</span>
            )}
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={copy}
          disabled={!configured}
          aria-label={`Copy ${entry.name} address`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={12} />
          {copied ? 'COPIED' : 'COPY'}
        </button>

        {entry.explorer ? (
          <a
            className={styles.linkBtn}
            href={entry.explorer}
            target="_blank"
            rel="noopener noreferrer"
          >
            {entry.explorerLabel}
            <Icon name="external" size={12} />
          </a>
        ) : (
          <span className={styles.disabledBtn}>{entry.explorerLabel}</span>
        )}
      </div>
    </article>
  );
}

export default ContractCard;
