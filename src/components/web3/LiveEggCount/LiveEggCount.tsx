'use client';

import { useReadContract } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { EGG_NFT_ADDRESS, NOT_CONFIGURED_LABEL, isConfigured } from '@/config/contracts';
import { eggNftAbi } from '@/lib/web3/abis';
import styles from './LiveEggCount.module.css';

/**
 * Reads EGG totalSupply straight from the NFT contract.
 * With no address configured it says so — it never invents a number.
 */
export function LiveEggCount({ className }: { className?: string }) {
  const address = isConfigured(EGG_NFT_ADDRESS) ? EGG_NFT_ADDRESS : undefined;

  const { data, isLoading, isError } = useReadContract({
    address,
    abi: eggNftAbi,
    functionName: 'totalSupply',
    chainId: mainnet.id,
    query: { enabled: Boolean(address) },
  });

  if (!address) {
    return (
      <div className={[styles.box, styles.unset, className].filter(Boolean).join(' ')}>
        <span className={styles.value}>—</span>
        <span className={styles.label}>ACTUAL EGGS</span>
        <span className={styles.state}>{NOT_CONFIGURED_LABEL}</span>
      </div>
    );
  }

  return (
    <div className={[styles.box, className].filter(Boolean).join(' ')}>
      <span className={styles.value}>
        {isLoading ? '····' : isError ? '—' : Number(data ?? 0n).toLocaleString('en-US')}
      </span>
      <span className={styles.label}>ACTUAL EGGS</span>
      <span className={[styles.state, styles.live].join(' ')}>
        {isError ? 'READ FAILED' : 'LIVE ON-CHAIN'}
      </span>
    </div>
  );
}

export default LiveEggCount;
