import Link from 'next/link';
import Icon from '@/components/pixel/Icon/Icon';
import {
  EGG_NFT_ADDRESS,
  NETWORK_NAME,
  NOT_CONFIGURED_LABEL,
  POOL_ID,
  UNEST_TOKEN_ADDRESS,
  isConfigured,
} from '@/config/contracts';
import { grouped, shortAddress } from '@/lib/utils/format';
import {
  MINT_UNIT,
  THEORETICAL_MAX_EGGS,
  UNEST_DECIMALS,
  UNEST_STANDARD,
  UNEST_SUPPLY,
  EGG_STANDARD,
} from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './AssetPanel.module.css';

interface Row {
  k: string;
  v: string;
}

function Card({
  icon,
  name,
  kicker,
  role,
  rows,
  address,
  accent,
}: {
  icon: React.ReactNode;
  name: string;
  kicker: string;
  role: string;
  rows: Row[];
  address: string;
  accent: 'yolk' | 'green' | 'blue';
}) {
  return (
    <article className={[styles.card, styles[accent]].join(' ')}>
      <header className={styles.head}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <div>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.kicker}>{kicker}</span>
        </div>
      </header>

      <dl className={styles.rows}>
        {rows.map((r) => (
          <div key={r.k} className={styles.row}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
      </dl>

      <footer className={styles.foot}>
        <span className={styles.roleLabel}>ROLE</span>
        <span className={styles.role}>{role}</span>
      </footer>

      <div className={styles.addr}>
        {isConfigured(address) ? (
          <code title={address}>{shortAddress(address, 6)}</code>
        ) : (
          <span className={styles.unset}>{NOT_CONFIGURED_LABEL}</span>
        )}
      </div>
    </article>
  );
}

/**
 * The terminal panel that states, once and unambiguously, what each asset is.
 * $UNEST is the token. EGG is the NFT. The pool is the gate between them.
 */
export function AssetPanel() {
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <span className={styles.barDot} />
        <span className={styles.barText}>THE NEST · ASSET REGISTRY</span>
        <Link href="/contracts" className={styles.barLink}>
          VERIFY →
        </Link>
      </div>

      <div className={styles.grid}>
        <Card
          accent="yolk"
          icon={<Icon name="coins" size={18} />}
          name="$UNEST"
          kicker={`${UNEST_STANDARD} · ${NETWORK_NAME}`}
          role="THE FUEL"
          address={UNEST_TOKEN_ADDRESS}
          rows={[
            { k: 'Total Supply', v: grouped(UNEST_SUPPLY) },
            { k: 'Decimals', v: String(UNEST_DECIMALS) },
            { k: 'Consumed by', v: 'HATCH · FEED · BREED · EVOLVE' },
          ]}
        />

        <Card
          accent="green"
          icon={<Icon name="egg" size={18} />}
          name="EGG"
          kicker={`${EGG_STANDARD} · ${NETWORK_NAME}`}
          role="THE CREATURE"
          address={EGG_NFT_ADDRESS}
          rows={[
            { k: 'Theoretical Maximum', v: grouped(THEORETICAL_MAX_EGGS) },
            { k: 'Mint Unit', v: `${compact(MINT_UNIT)} $UNEST` },
            { k: 'Backing per EGG', v: `${compact(MINT_UNIT)} $UNEST (liquid)` },
          ]}
        />

        <Card
          accent="blue"
          icon={<Icon name="waves" size={18} />}
          name="OFFICIAL POOL"
          kicker="ETH / $UNEST · Uniswap v4"
          role="THE GATE"
          address={POOL_ID}
          rows={[
            { k: 'Pair', v: 'ETH / $UNEST' },
            { k: 'Version', v: 'Uniswap v4 + UNEST Hook' },
            { k: 'Qualifying buys', v: 'Only from this pool' },
          ]}
        />
      </div>

      <p className={styles.note}>
        Normal transfers do not mint EGGs. Receiving $UNEST does not mint EGGs. Only a qualifying
        purchase from the official pool does.
      </p>
    </div>
  );
}

export default AssetPanel;
