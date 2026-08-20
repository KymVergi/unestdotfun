import type { Metadata } from 'next';
import Icon from '@/components/pixel/Icon/Icon';
import Section, { PageHero } from '@/components/layout/Section/Section';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import Badge from '@/components/pixel/Badge/Badge';
import HookCard from '@/components/hooks/HookCard/HookCard';
import HookArchitecture from '@/components/hooks/HookArchitecture/HookArchitecture';
import RewardSplit from '@/components/protocol/RewardSplit/RewardSplit';
import FlowChain from '@/components/protocol/FlowChain/FlowChain';
import Furnace from '@/components/farm/Furnace/Furnace';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import {
  BACKING_PER_EGG,
  BREED_COOLDOWN,
  BREED_COST,
  BREED_PARENT_ROYALTY_PCT,
  BREED_ROYALTY_DAYS,
  MINT_UNIT,
} from '@/config/protocol';
import { compact } from '@/lib/utils/format';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'The Engine',
  description:
    'Uniswap v4 hooks are the infrastructure layer enforcing UNEST pool-level mechanics: minting, fees, backing, rewards, buyback and breeding.',
};

export default function HooksPage() {
  return (
    <>
      <PageHero
        eyebrow="INFRASTRUCTURE"
        title="THE ENGINE"
        lead={
          <p>
            <strong>POWERED BY UNISWAP V4 HOOKS.</strong> A hook is contract code attached to a
            specific pool that runs as part of the swap itself. UNEST uses that to enforce its
            economics at the pool level, where they cannot be faked by a wallet.
          </p>
        }
      >
        <div className={styles.badges}>
          <Badge tone="live" dot>
            ETHEREUM MAINNET
          </Badge>
          <Badge tone="info">UNISWAP V4</Badge>
          <Badge tone="yolk">POOL-LEVEL ENFORCEMENT</Badge>
        </div>
      </PageHero>

      <Section size="md">
        <SectionHeader
          eyebrow="WHY IT MATTERS"
          title="THE POOL IS THE SOURCE OF TRUTH"
          lead={
            <p>
              Without a hook, a protocol has to guess what happened from balances and transfers.
              With a hook, the pool itself reports the swap as it settles. That difference is the
              whole reason the EGG mint rule can be strict: only qualifying purchases from the
              official pool count.
            </p>
          }
        />

        <div className={styles.grid}>
          <HookCard
            index="01"
            tone="yolk"
            icon={<Icon name="egg" size={18} />}
            title="MINT HOOK"
            summary="Detects qualifying purchases and turns complete units of purchase volume into Sealed EGGs."
            responsibilities={[
              'Detect qualifying ETH/$UNEST purchases',
              'Track qualifying purchase amount per buyer',
              `Calculate complete ${compact(MINT_UNIT)} $UNEST units`,
              'Trigger Sealed EGG creation',
            ]}
          >
            <div className={styles.equation}>
              <span>{compact(MINT_UNIT)} $UNEST</span>
              <em>→</em>
              <span>1 SEALED EGG</span>
            </div>
            <p className={styles.fine}>
              Only the official pool qualifies. Partial amounts do not mint — they wait for the next
              complete unit.
            </p>
          </HookCard>

          <HookCard
            index="02"
            tone="green"
            icon={<Icon name="split" size={18} />}
            title="FEE HOOK"
            summary="Routes pool fees to the four destinations that keep the Nest running."
          >
            <RewardSplit flow />
          </HookCard>

          <HookCard
            index="03"
            tone="blue"
            icon={<Icon name="scale" size={18} />}
            title="BACKING ENGINE"
            summary={`Maintains the relationship between EGGs held and $UNEST held: 1 EGG to ${compact(BACKING_PER_EGG)} $UNEST of wallet backing.`}
            responsibilities={[
              'Track EGG ownership',
              'Track $UNEST balance',
              'Derive supported EGG capacity',
              'Burn unsupported EGGs per protocol rules',
            ]}
          >
            <div className={styles.equation}>
              <span>1 EGG</span>
              <em>↔</em>
              <span>{compact(BACKING_PER_EGG)} $UNEST</span>
            </div>
            <p className={styles.fine}>
              The $UNEST is never locked. Backing is a balance requirement, not custody.
            </p>
          </HookCard>

          <HookCard
            index="04"
            tone="purple"
            icon={<Icon name="gauge" size={18} />}
            title="REWARD ENGINE"
            summary="Distributes the creature share of pool fees by Effective Reward Weight. Only active creatures participate."
          >
            <div className={styles.formula}>
              <span className={styles.formulaOut}>EFFECTIVE WEIGHT</span>
              <span className={styles.formulaEq}>=</span>
              <span className={styles.formulaIn}>REWARD WEIGHT</span>
              <span className={styles.formulaOp}>×</span>
              <span className={styles.formulaIn}>ENERGY %</span>
            </div>
            <ul className={styles.miniList}>
              <li>Hibernating creatures are excluded entirely.</li>
              <li>Weight without Energy earns nothing.</li>
              <li>No fixed rate is promised — distribution depends on pool activity.</li>
            </ul>
          </HookCard>

          <HookCard
            index="05"
            tone="barn"
            icon={<Icon name="flame" size={18} />}
            title="BUYBACK & BURN"
            summary="Takes the buyback slice of the fee allocation, buys $UNEST from the official pool and destroys it."
          >
            <div className={styles.buyback}>
              <FlowChain
                nodes={[
                  { label: '3% OF FEES', tone: 'plain' },
                  { label: 'BUYBACK', note: 'from the official pool', tone: 'blue' },
                  { label: '$UNEST', tone: 'yolk' },
                  { label: 'BURN', note: 'supply removed', tone: 'barn' },
                ]}
              />
              <Furnace intensity="hot" label="Buyback furnace" />
            </div>
          </HookCard>

          <HookCard
            index="06"
            tone="yolk"
            icon={<Icon name="coins" size={18} />}
            title="BREEDING ENGINE"
            summary="Pairs two active creatures, burns fuel, applies the cooldown and issues a new Sealed EGG."
          >
            <FlowChain
              nodes={[
                { label: 'CREATURE A + CREATURE B', note: 'both Energy > 0', tone: 'green' },
                { label: `${compact(BREED_COST)} $UNEST BURN`, tone: 'barn' },
                { label: `${BREED_COOLDOWN} DAY COOLDOWN`, tone: 'plain' },
                { label: 'NEW SEALED EGG', tone: 'yolk' },
              ]}
            />
            <p className={styles.fine}>
              Parents each receive {BREED_PARENT_ROYALTY_PCT}% of the child&apos;s rewards for{' '}
              {BREED_ROYALTY_DAYS} days.
            </p>
          </HookCard>
        </div>
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeader
          eyebrow="ARCHITECTURE"
          title="HOW THE PIECES CONNECT"
          lead={<p>One pool, one hook, six engines, one Nest.</p>}
        />
        <HookArchitecture />
      </Section>

      <Section size="md">
        <SectionHeader
          eyebrow="BOUNDARIES"
          title="WHAT THE HOOK DOES NOT DO"
          lead={<p>Being precise about the limits is part of being technically serious.</p>}
        />

        <ul className={styles.boundaries}>
          <li>
            <b>It does not custody your $UNEST.</b> Backing is checked against your balance; the
            tokens never leave your wallet.
          </li>
          <li>
            <b>It does not watch other pools.</b> A purchase somewhere else is just a purchase.
          </li>
          <li>
            <b>It does not guarantee rewards.</b> It distributes what the pool actually generates.
          </li>
          <li>
            <b>It does not reverse a hatch.</b> Traits are written once and stay written.
          </li>
          <li>
            <b>It does not lower Reward Weight on a failed evolution</b> in the initial
            implementation.
          </li>
        </ul>

        <div className={styles.cta}>
          <PixelLink href="/contracts" size="lg">
            VERIFY THE CONTRACTS
          </PixelLink>
          <PixelLink href="/docs" size="lg" variant="ghost">
            READ THE DOCS
          </PixelLink>
        </div>
      </Section>
    </>
  );
}
