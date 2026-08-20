'use client';

import { useEffect, useRef } from 'react';
import { parseUnits, type Abi } from 'viem';
import {
  useAccount,
  useChainId,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import Icon from '@/components/pixel/Icon/Icon';
import { PixelButton, type ButtonVariant } from '@/components/pixel/PixelButton/PixelButton';
import {
  NOT_CONFIGURED_LABEL,
  UNEST_TOKEN_ADDRESS,
  etherscanTx,
  isConfigured,
} from '@/config/contracts';
import { UNEST_DECIMALS } from '@/config/protocol';
import { erc20Abi } from '@/lib/web3/abis';
import { TARGET_CHAIN } from '@/lib/web3/config';
import styles from './TxButton.module.css';

export interface TxButtonProps {
  label: string;
  /** Human label for the cost, e.g. "2.5M $UNEST". Display only. */
  cost?: string;
  /**
   * Whole $UNEST the contract will pull from the wallet. When set, the button
   * runs the ERC-20 approve step first and only then the action itself.
   */
  spendAmount?: number;
  variant?: ButtonVariant;
  /** Empty string means the contract is not configured. */
  address: string;
  abi: Abi | readonly unknown[];
  functionName: string;
  args?: readonly unknown[];
  /** Protocol-level reason the action is unavailable, e.g. "ENERGY TOO LOW". */
  blockedReason?: string;
  onConfirmed?: () => void;
  full?: boolean;
}

type Phase = 'idle' | 'approving' | 'acting';

/**
 * One on-chain action, with the whole real lifecycle:
 * allowance check → approve → simulate → write → receipt.
 *
 * It never simulates a transaction for show. Where a contract address is
 * missing the button is disabled and says CONTRACT NOT CONFIGURED, and the
 * only hashes it ever displays come back from the wallet.
 */
export function TxButton({
  label,
  cost,
  spendAmount,
  variant = 'secondary',
  address,
  abi,
  functionName,
  args = [],
  blockedReason,
  onConfirmed,
  full = true,
}: TxButtonProps) {
  const { address: account, isConnected } = useAccount();
  const chainId = useChainId();

  // Which kind of transaction is in flight. A ref, not state: it must not
  // trigger a render on its own, and it is only read inside callbacks.
  const phase = useRef<Phase>('idle');

  const configured = address.length > 0;
  const tokenAddress = isConfigured(UNEST_TOKEN_ADDRESS) ? UNEST_TOKEN_ADDRESS : undefined;
  const wrongNetwork = isConnected && chainId !== TARGET_CHAIN.id;

  const required = spendAmount ? parseUnits(String(spendAmount), UNEST_DECIMALS) : 0n;
  const needsApprovalFlow = required > 0n && Boolean(tokenAddress) && configured;

  /* ---- allowance ------------------------------------------------------- */
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: account && configured ? [account, address as `0x${string}`] : undefined,
    chainId: mainnet.id,
    query: { enabled: Boolean(needsApprovalFlow && account) },
  });

  const approved = !needsApprovalFlow || (allowance ?? 0n) >= required;

  /* ---- balance --------------------------------------------------------- */
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: account ? [account] : undefined,
    chainId: mainnet.id,
    query: { enabled: Boolean(tokenAddress && account && required > 0n) },
  });

  const insufficient = required > 0n && balance !== undefined && balance < required;

  /* ---- simulation ------------------------------------------------------ */
  const canSimulate =
    configured && isConnected && !wrongNetwork && !blockedReason && approved && !insufficient;

  const { data: simulation, error: simulationError } = useSimulateContract({
    address: configured ? (address as `0x${string}`) : undefined,
    abi: abi as Abi,
    functionName,
    args: args as readonly unknown[],
    account,
    chainId: mainnet.id,
    query: { enabled: canSimulate },
  });

  /* ---- write ----------------------------------------------------------- */
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: receiptFailed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!isSuccess) return;

    if (phase.current === 'approving') {
      // The approval landed: refresh the allowance so the button becomes the
      // action itself, and clear the write state so the next click is clean.
      phase.current = 'idle';
      void refetchAllowance();
      reset();
      return;
    }

    phase.current = 'idle';
    onConfirmed?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  /* ---- state readout --------------------------------------------------- */
  let state: string | null = null;
  let tone = styles.info;

  if (!configured) {
    state = NOT_CONFIGURED_LABEL;
    tone = styles.warnState;
  } else if (!isConnected) {
    state = 'CONNECT WALLET FIRST';
  } else if (wrongNetwork) {
    state = 'WRONG NETWORK';
    tone = styles.warnState;
  } else if (blockedReason) {
    state = blockedReason;
    tone = styles.warnState;
  } else if (insufficient) {
    state = 'NOT ENOUGH $UNEST';
    tone = styles.failState;
  } else if (isPending) {
    state = 'CONFIRM IN WALLET';
  } else if (isConfirming) {
    state = 'PENDING';
  } else if (isSuccess) {
    state = 'CONFIRMED';
    tone = styles.okState;
  } else if (receiptFailed || writeError) {
    state = 'FAILED';
    tone = styles.failState;
  } else if (!approved) {
    state = 'APPROVAL REQUIRED';
    tone = styles.warnState;
  } else if (simulationError) {
    state = 'WOULD REVERT';
    tone = styles.failState;
  }

  const busy = isPending || isConfirming;
  const disabled =
    !configured || !isConnected || wrongNetwork || Boolean(blockedReason) || insufficient || busy;

  const actionDisabled = disabled || (approved && !simulation);
  const buttonLabel = !approved ? `APPROVE $UNEST` : label;

  function run() {
    reset();
    if (!configured || !account) return;

    if (!approved && tokenAddress) {
      phase.current = 'approving';
      writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [address as `0x${string}`, required],
        chainId: TARGET_CHAIN.id,
      });
      return;
    }

    if (!simulation) return;
    phase.current = 'acting';
    writeContract(simulation.request);
  }

  const explorer = etherscanTx(hash);

  return (
    <div className={styles.wrap}>
      <PixelButton
        size="sm"
        variant={!approved ? 'primary' : variant}
        full={full}
        disabled={!approved ? disabled : actionDisabled}
        onClick={run}
      >
        <span className={styles.label}>
          {busy ? <Icon name="spinner" size={10} className={styles.spin} /> : null}
          {buttonLabel}
        </span>
        {cost && approved ? <span className={styles.cost}>{cost}</span> : null}
      </PixelButton>

      {state ? (
        <span className={[styles.state, tone].join(' ')}>
          {state}
          {explorer && (isConfirming || isSuccess) ? (
            <a href={explorer} target="_blank" rel="noopener noreferrer" className={styles.txLink}>
              TX <Icon name="external" size={9} />
            </a>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}

export default TxButton;
