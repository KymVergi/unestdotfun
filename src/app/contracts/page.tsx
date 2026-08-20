import type { Metadata } from 'next';
import Icon from '@/components/pixel/Icon/Icon';
import Section, { PageHero } from '@/components/layout/Section/Section';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import Badge from '@/components/pixel/Badge/Badge';
import Panel from '@/components/pixel/Panel/Panel';
import ContractCard from '@/components/contracts/ContractCard/ContractCard';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import { CHAIN_ID, CONTRACT_REGISTRY, CORE_CONFIGURED, NETWORK_NAME } from '@/config/contracts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contracts',
  description:
    'The UNEST contract registry on Ethereum mainnet: token, EGG NFT, Uniswap v4 pool, hook and engines.',
};

export default function ContractsPage() {
  const pending = CONTRACT_REGISTRY.filter((e) => e.value.length === 0).length;

  return (
    <>
      <PageHero
        eyebrow="VERIFY EVERYTHING"
        title="CONTRACTS"
        lead={
          <p>
            Everything the protocol touches, listed in one place. Addresses shown as{' '}
            <strong>0x…</strong> are placeholders — no address is invented here. When the deployment
            is published, these entries resolve to real, verifiable contracts.
          </p>
        }
      >
        <div className={styles.badges}>
          <Badge tone={CORE_CONFIGURED ? 'live' : 'yolk'} dot={CORE_CONFIGURED}>
            {CORE_CONFIGURED ? 'ADDRESSES CONFIGURED' : `${pending} ENTRIES PENDING`}
          </Badge>
          <Badge tone="info">{NETWORK_NAME}</Badge>
          <Badge tone="muted">CHAIN ID {CHAIN_ID}</Badge>
        </div>
      </PageHero>

      <Section size="md">
        <div className={styles.grid}>
          {CONTRACT_REGISTRY.map((entry) => (
            <ContractCard key={entry.id} entry={entry} />
          ))}
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeader
          eyebrow="SECURITY & TRANSPARENCY"
          title="DO NOT TAKE OUR WORD FOR IT"
          lead={
            <p>
              Check every address against the explorer before you interact with anything. If an
              address here does not match what a wallet, bot or message tells you, trust neither
              until you have verified on-chain.
            </p>
          }
        />

        <div className={styles.securityGrid}>
          <Panel title="WHAT WE DO NOT CLAIM" tone="barn">
            <ul className={styles.claims}>
              <li>We do not claim the contracts are audited.</li>
              <li>We do not claim the protocol is risk free.</li>
              <li>We do not promise yield.</li>
              <li>We do not promise rewards of any size.</li>
              <li>We do not display an APR, because none can be guaranteed.</li>
            </ul>
            <p className={styles.claimsNote}>
              If any of these change, the claim will appear here with the evidence attached — not in
              a chat message.
            </p>
          </Panel>

          <Panel title="VERIFY THIS LIST" tone="terminal">
            <ol className={styles.steps}>
              <li>Open the entry you care about on Etherscan.</li>
              <li>Confirm the contract source is verified and matches the stated standard.</li>
              <li>
                For the pool, confirm the hook address attached to it is the same one listed here.
              </li>
              <li>Confirm the token contract is the one your wallet is about to approve.</li>
            </ol>
            <p className={styles.stepsNote}>
              <Icon name="shield" size={12} /> Anything asking you to approve an unlisted contract
              is not part of UNEST.
            </p>
          </Panel>
        </div>

        <div className={styles.cta}>
          <PixelLink href="/docs#security" size="lg" variant="ghost">
            SECURITY NOTES
          </PixelLink>
          <PixelLink href="/hooks" size="lg" variant="secondary">
            HOW THE HOOK WORKS
          </PixelLink>
        </div>
      </Section>
    </>
  );
}
