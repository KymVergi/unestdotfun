'use client';

import { useSyncExternalStore } from 'react';

/**
 * A ticking clock exposed as an external store.
 *
 * Energy decays with wall-clock time, so the interface needs a *reactive*
 * timestamp: reading Date.now() during render is impure and, worse, would
 * freeze the displayed energy until something else happened to re-render.
 *
 * The snapshot has minute resolution so it stays referentially stable between
 * ticks, which is what useSyncExternalStore requires.
 */

const TICK_MS = 60_000;

function subscribe(onChange: () => void): () => void {
  const timer = setInterval(onChange, TICK_MS);
  return () => clearInterval(timer);
}

function getSnapshot(): number {
  return Math.floor(Date.now() / TICK_MS);
}

/** No clock on the server — callers treat 0 as "no decay information". */
function getServerSnapshot(): number {
  return 0;
}

/** Current unix time in seconds, refreshed once a minute. */
export function useNowSeconds(): number {
  const minutes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return minutes * (TICK_MS / 1000);
}
