'use client';

import { useState } from 'react';
import { useAccount, useBalance, useChainId, useReadContract } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import Icon from '@/components/pixel/Icon/Icon';
import ConnectWallet from '@/components/web3/ConnectWallet/ConnectWallet';
import TxButton from '@/components/web3/TxButton/TxButton';
import CreatureCard from '@/components/creatures/CreatureCard/CreatureCard';
import BreedDialog from '@/components/nest/BreedDialog/BreedDialog';
import Badge from '@/components/pixel/Badge/Badge';
import Stat, { StatGrid } from '@/components/pixel/Stat/Stat';
import { PixelButton, PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import {
  BREED_COST,
  EVOLUTION_COST,
  EVOLUTION_MIN_ENERGY,
  FEED_COST,
  HATCH_COST,
  MAX_ENERGY,
  UNEST_DECIMALS,
  effectiveWeight,
  supportedEggs,
} from '@/config/protocol';
import {
  DEMO_LABEL,
  EGG_NFT_ADDRESS,
  NOT_CONFIGURED_LABEL,
  REWARD_ENGINE_ADDRESS,
  UNEST_TOKEN_ADDRESS,
  isConfigured,
} from '@/config/contracts';
import { eggNftAbi, erc20Abi, rewardEngineAbi } from '@/lib/web3/abis';
import { useNest } from '@/lib/web3/useNest';
import { useNowSeconds } from '@/lib/hooks/useNowSeconds';
import { nestTotals, type Creature } from '@/lib/protocol/creature';
import { formatHours, hoursUntilHibernation, secondsUntil } from '@/lib/protocol/energy';
import { compact, formatUnitsCompact } from '@/lib/utils/format';
import { TARGET_CHAIN } from '@/lib/web3/config';
import styles from './NestDashboard.module.css';

export function NestDashboard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const wrongNetwork = isConnected && chainId !== TARGET_CHAIN.id;
  const [breedWith, setBreedWith] = useState<Creature | null>(null);
  const now = useNowSeconds();

  const tokenAddress = isConfigured(UNEST_TOKEN_ADDRESS) ? UNEST_TOKEN_ADDRESS : undefined;
  const rewardAddress = isConfigured(REWARD_ENGINE_ADDRESS) ? REWARD_ENGINE_ADDRESS : undefined;

  const nest = useNest(address);
  const creatures = nest.creatures;
  const totals = nestTotals(creatures);

  const { data: unestBalance, refetch: refetchUnest } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: mainnet.id,
    query: { enabled: Boolean(tokenAddress && address) },
  });

  const { data: pending, refetch: refetchPending } = useReadContract({
    address: rewardAddress,
    abi: rewardEngineAbi,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    chainId: mainnet.id,
    query: { enabled: Boolean(rewardAddress && address) },
  });

  const { data: ethBalance } = useBalance({
    address,
    chainId: mainnet.id,
    query: { enabled: Boolean(address) },
  });

  function refreshAll() {
    nest.refetch();
    void refetchUnest();
    void refetchPending();
  }

  /* ---- gate: no wallet ------------------------------------------------- */
  if (!isConnected) {
    return (
      <div className={styles.gate}>
        <span className={styles.gateIcon} aria-hidden="true">
          <Icon name="wallet" size={30} />
        </span>
        <h2 className={styles.gateTitle}>THE NEST IS LOCKED</h2>
        <p className={styles.gateText}>
          Connect a wallet on Ethereum mainnet to see your $UNEST balance, your EGGs and your
          creatures. Nothing is read from the chain until you do.
        </p>
        <ConnectWallet />
        <div className={styles.gateLinks}>
          <PixelLink href="/protocol" variant="ghost" size="sm">
            HOW IT WORKS
          </PixelLink>
          <PixelLink href="/creatures" variant="ghost" size="sm">
            BROWSE CREATURES
          </PixelLink>
        </div>
      </div>
    );
  }

  /* ---- gate: wrong network --------------------------------------------- */
  if (wrongNetwork) {
    return (
      <div className={[styles.gate, styles.gateWarn].join(' ')}>
        <span className={styles.gateIcon} aria-hidden="true">
          <Icon name="alert" size={30} />
        </span>
        <h2 className={styles.gateTitle}>WRONG NETWORK</h2>
        <p className={styles.gateText}>
          UNEST lives on {TARGET_CHAIN.name}. Switch networks to continue.
        </p>
        <ConnectWallet />
      </div>
    );
  }

  /* ---- derived --------------------------------------------------------- */
  const unestWhole =
    unestBalance !== undefined ? Number(unestBalance) / 10 ** UNEST_DECIMALS : null;
  const capacity = unestWhole !== null ? supportedEggs(unestWhole) : null;
  const underBacked = capacity !== null && capacity < creatures.length;

  return (
    <div className={styles.wrap}>
      <div className={styles.statusRow}>
        {nest.source === 'demo' ? (
          <Badge tone="yolk">{DEMO_LABEL} · CREATURES BELOW ARE ILLUSTRATIVE</Badge>
        ) : (
          <Badge tone="live" dot>
            {nest.isLoading ? 'READING FROM CHAIN…' : 'LIVE FROM CHAIN'}
          </Badge>
        )}
        <Badge tone="info">{TARGET_CHAIN.name}</Badge>
        {nest.truncated ? (
          <Badge tone="barn">
            SHOWING FIRST {creatures.length} OF {nest.total}
          </Badge>
        ) : null}
        <PixelButton size="sm" variant="ghost" onClick={refreshAll}>
          REFRESH
        </PixelButton>
      </div>

      <StatGrid columns={6} className={styles.stats}>
        <Stat
          size="sm"
          accent="yolk"
          value={
            tokenAddress
              ? unestBalance !== undefined
                ? formatUnitsCompact(unestBalance, UNEST_DECIMALS)
                : '····'
              : '—'
          }
          label="$UNEST BALANCE"
          hint={tokenAddress ? undefined : NOT_CONFIGURED_LABEL}
        />
        <Stat
          size="sm"
          accent={underBacked ? 'barn' : 'green'}
          value={capacity !== null ? capacity : creatures.length}
          label="SUPPORTED EGGS"
          hint={capacity !== null ? `HOLDING ${creatures.length}` : DEMO_LABEL}
        />
        <Stat size="sm" accent="green" value={totals.active} label="ACTIVE CREATURES" />
        <Stat size="sm" accent="barn" value={totals.hibernating} label="HIBERNATING" />
        <Stat
          size="sm"
          accent="plain"
          value={totals.totalEffectiveWeight}
          label="EFFECTIVE WEIGHT"
          hint={`TOTAL ${totals.totalWeight}`}
        />
        <Stat
          size="sm"
          accent="yolk"
          value={
            rewardAddress
              ? pending !== undefined
                ? `${formatUnitsCompact(pending, 18, 5)} ETH`
                : '····'
              : '—'
          }
          label="PENDING ETH"
          hint={rewardAddress ? undefined : NOT_CONFIGURED_LABEL}
        />
      </StatGrid>

      {underBacked ? (
        <p className={styles.underBacked}>
          <Icon name="alert" size={12} /> This wallet holds {creatures.length} EGGs but only backs{' '}
          {capacity}. Under-backed EGGs are burned according to protocol rules — top the balance up
          or expect the difference to go.
        </p>
      ) : null}

      <div className={styles.walletRow}>
        <span className={styles.walletLabel}>WALLET ETH</span>
        <span className={styles.walletValue}>
          {ethBalance
            ? `${formatUnitsCompact(ethBalance.value, ethBalance.decimals, 4)} ${ethBalance.symbol}`
            : '····'}
        </span>
        <TxButton
          label="CLAIM ALL"
          variant="primary"
          address={REWARD_ENGINE_ADDRESS}
          abi={rewardEngineAbi}
          functionName="claim"
          blockedReason={pending !== undefined && pending === 0n ? 'NOTHING TO CLAIM' : undefined}
          onConfirmed={refreshAll}
        />
      </div>

      {nest.isLoading && creatures.length === 0 ? (
        <p className={styles.loading}>READING YOUR NEST FROM THE CHAIN…</p>
      ) : null}

      {!nest.isLoading && creatures.length === 0 ? (
        <div className={styles.emptyNest}>
          <Icon name="egg" size={36} />
          <h3>NO EGGS IN THIS WALLET</h3>
          <p>
            EGGs are created by qualifying purchases from the official ETH/$UNEST pool. Every
            complete {compact(HATCH_COST * 20)} $UNEST bought produces one Sealed EGG.
          </p>
          <PixelLink href="/protocol#step-1" size="sm" variant="ghost">
            HOW MINTING WORKS
          </PixelLink>
        </div>
      ) : null}

      <div className={styles.grid}>
        {creatures.map((c) => {
          const eff = c.isSealed ? 0 : effectiveWeight(c.rewardWeight, c.energy);
          const cooldown = secondsUntil(c.breedReadyAt, now);

          return (
            <CreatureCard
              key={c.id}
              creature={c}
              showTraits={!c.isSealed}
              actions={
                c.isSealed ? (
                  <TxButton
                    label="HATCH"
                    cost={`${compact(HATCH_COST)} $UNEST`}
                    spendAmount={HATCH_COST}
                    variant="primary"
                    address={EGG_NFT_ADDRESS}
                    abi={eggNftAbi}
                    functionName="hatch"
                    args={[BigInt(c.id)]}
                    blockedReason={
                      c.blocksToReveal > 0 ? `WAIT ${c.blocksToReveal} BLOCKS` : undefined
                    }
                    onConfirmed={refreshAll}
                  />
                ) : (
                  <>
                    <TxButton
                      label="FEED"
                      cost={`${compact(FEED_COST)} $UNEST`}
                      spendAmount={FEED_COST}
                      variant="primary"
                      address={EGG_NFT_ADDRESS}
                      abi={eggNftAbi}
                      functionName="feed"
                      args={[BigInt(c.id)]}
                      blockedReason={c.energy >= MAX_ENERGY ? 'ENERGY FULL' : undefined}
                      onConfirmed={refreshAll}
                    />

                    <PixelButton
                      size="sm"
                      variant="secondary"
                      full
                      disabled={c.energy <= 0 || cooldown > 0}
                      onClick={() => setBreedWith(c)}
                    >
                      BREED
                      <span className={styles.btnCost}>{compact(BREED_COST)} $UNEST</span>
                    </PixelButton>
                    {c.energy <= 0 ? (
                      <span className={styles.hint}>HIBERNATING</span>
                    ) : cooldown > 0 ? (
                      <span className={styles.hint}>COOLDOWN {formatHours(cooldown / 3600)}</span>
                    ) : null}

                    <TxButton
                      label="EVOLVE"
                      cost={`${compact(EVOLUTION_COST)} $UNEST`}
                      spendAmount={EVOLUTION_COST}
                      address={EGG_NFT_ADDRESS}
                      abi={eggNftAbi}
                      functionName="evolve"
                      args={[BigInt(c.id)]}
                      blockedReason={
                        c.energy < EVOLUTION_MIN_ENERGY
                          ? `NEEDS ${EVOLUTION_MIN_ENERGY} ENERGY`
                          : undefined
                      }
                      onConfirmed={refreshAll}
                    />

                    <span className={styles.effNote}>
                      EFFECTIVE {eff} · HIBERNATES IN {formatHours(hoursUntilHibernation(c.energy))}
                    </span>
                  </>
                )
              }
            />
          );
        })}
      </div>

      <p className={styles.footNote}>
        Actions are real transactions signed by your wallet, simulated against the contract before
        they are offered. Nothing here fabricates a hash or shows a confirmation that did not
        happen. Where a contract address is missing the action is disabled and labelled{' '}
        <strong>{NOT_CONFIGURED_LABEL}</strong>.
      </p>

      {breedWith ? (
        <BreedDialog
          self={breedWith}
          all={creatures}
          onClose={() => setBreedWith(null)}
          onBred={refreshAll}
        />
      ) : null}
    </div>
  );
}

export default NestDashboard;
