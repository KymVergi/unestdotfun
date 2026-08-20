import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import NestDashboard from '@/components/nest/NestDashboard/NestDashboard';
import BackingPanel from '@/components/nest/BackingPanel/BackingPanel';
import EnergyLadder from '@/components/nest/EnergyLadder/EnergyLadder';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import { BACKING_PER_EGG, FEED_COST, MAX_ENERGY } from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Your Nest',
  description:
    'The UNEST dashboard: balances, supported EGGs, creature energy, reward weight and on-chain actions.',
};

export default function NestPage() {
  return (
    <>
      <PageHero
        eyebrow="THE DASHBOARD"
        title="YOUR NEST"
        lead={
          <p>
            Everything your wallet supports, in one place. Feed what is hungry, hatch what is
            sealed, and keep the balance that backs it all.
          </p>
        }
      />

      <Section width="wide" size="md">
        <NestDashboard />
      </Section>

      <Section tone="field" size="md">
        <SectionHeader
          eyebrow="MAINTENANCE"
          title="ENERGY IS THE JOB"
          lead={
            <p>
              A creature at {MAX_ENERGY} Energy earns its full Effective Weight. A creature at 0
              earns nothing. Feeding costs {compact(FEED_COST)} $UNEST.
            </p>
          }
        />
        <EnergyLadder />
      </Section>

      <Section tone="soil" size="md">
        <SectionHeader
          eyebrow="BACKING CHECK"
          title="CAN YOUR WALLET STILL CARRY THEM?"
          lead={
            <p>
              {compact(BACKING_PER_EGG)} $UNEST per EGG, held — not locked. Drop below and the
              unsupported EGGs burn.
            </p>
          }
        />
        <BackingPanel />

        <div className={styles.cta}>
          <PixelLink href="/protocol#backing" variant="ghost" size="md">
            READ THE BACKING RULES
          </PixelLink>
          <PixelLink href="/contracts" variant="secondary" size="md">
            VERIFY CONTRACTS
          </PixelLink>
        </div>
      </Section>
    </>
  );
}
