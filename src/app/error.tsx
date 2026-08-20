'use client';

import { useEffect } from 'react';
import PixelEgg from '@/components/pixel/PixelEgg/PixelEgg';
import { PixelButton, PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the browser console and in the server logs of the host.
    console.error('[unest] route error', error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <div className={styles.art}>
        <PixelEgg id={500} crack={3} title="A broken EGG" />
      </div>
      <span className={styles.code}>SOMETHING CRACKED</span>
      <h1 className={styles.title}>THIS PART OF THE FARM IS DOWN</h1>
      <p className={styles.text}>
        The page failed to render. Nothing on-chain was affected — this interface only ever reads
        and asks your wallet to sign.
      </p>
      {error.digest ? <code className={styles.digest}>DIGEST {error.digest}</code> : null}
      <div className={styles.actions}>
        <PixelButton size="lg" onClick={reset}>
          TRY AGAIN
        </PixelButton>
        <PixelLink href="/" size="lg" variant="ghost">
          BACK TO THE FARM
        </PixelLink>
      </div>
    </div>
  );
}
