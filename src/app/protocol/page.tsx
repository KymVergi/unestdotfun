import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import Panel from '@/components/pixel/Panel/Panel';
import Badge from '@/components/pixel/Badge/Badge';
import Stat, { StatGrid } from '@/components/pixel/Stat/Stat';
import FlowChain from '@/components/protocol/FlowChain/FlowChain';
import Incubation from '@/components/protocol/Incubation/Incubation';
import HatchSequence from '@/components/protocol/HatchSequence/HatchSequence';
import RewardSplit from '@/components/protocol/RewardSplit/RewardSplit';
import EnergyLadder from '@/components/nest/EnergyLadder/EnergyLadder';
import BackingPanel from '@/components/nest/BackingPanel/BackingPanel';
import RewardWeightPanel from '@/components/creatures/RewardWeightPanel/RewardWeightPanel';
import BreedingPanel from '@/components/creatures/BreedingPanel/BreedingPanel';
import Bloodline from '@/components/creatures/Bloodline/Bloodline';
import EvolutionPanel from '@/components/creatures/EvolutionPanel/EvolutionPanel';
import Flywheel from '@/components/protocol/Flywheel/Flywheel';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import {
  BACKING_PER_EGG,
  HATCH_COST,
  MINT_UNIT,
  SEALED_REVEAL_BLOCKS,
  THEORETICAL_MAX_EGGS,
} from '@/config/protocol';
import { compact, grouped } from '@/lib/utils/format';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'How the Farm Works',
  description:
    'Buy $UNEST, receive a Sealed EGG, hatch it, feed it, earn. The full UNEST protocol flow.',
};

const BACKING_EXAMPLES = [
  { eggs: 1, unest: BACKING_PER_EGG },
  { eggs: 3, unest: BACKING_PER_EGG * 3 },
  { eggs: 10, unest: BACKING_PER_EGG * 10 },
];

export default function ProtocolPage() {
  return (
    <>
      <PageHero
        eyebrow="THE PROTOCOL"
        title="HOW THE FARM WORKS"
        lead={
          <p>
            Five steps, in order, with nothing hidden between them. <strong>$UNEST</strong> is the
            ERC-20 token. <strong>EGG</strong> is the ERC-721 NFT. Everything below is the machinery
            connecting the two.
          </p>
        }
      >
        <div className={styles.heroNav}>
          {['01 BUY', '02 EGG', '03 HATCH', '04 FEED', '05 GROW'].map((s, i) => (
            <a key={s} href={`#step-${i + 1}`} className={styles.heroNavItem}>
              {s}
            </a>
          ))}
        </div>
      </PageHero>

      {/* ---------------------------------------------------------------- 01 */}
      <Section id="step-1" tone="soil" size="md">
        <SectionHeader eyebrow="01 — BUY" title="BUY THE FUEL" />

        <div className={styles.twoCol}>
          <div className={styles.prose}>
            <p>
              A qualifying purchase from the official ETH/$UNEST Uniswap v4 pool can create Sealed
              EGG NFTs. Every complete <strong>{compact(MINT_UNIT)} $UNEST</strong> purchased from
              that pool produces <strong>1 SEALED EGG</strong>.
            </p>

            <Panel tone="barn" title="WHAT DOES NOT MINT AN EGG" className={styles.warnPanel}>
              <ul className={styles.negatives}>
                <li>Normal transfers do not mint EGGs.</li>
                <li>Receiving $UNEST does not mint EGGs.</li>
                <li>Accumulating {compact(MINT_UNIT)} through transfers does not mint EGGs.</li>
                <li>Buying from any other pool does not mint EGGs.</li>
              </ul>
              <p className={styles.negativeNote}>
                Only a qualifying purchase from the official pool triggers the EGG mint. The hook
                watches that pool and nothing else.
              </p>
            </Panel>

            <Panel tone="green" title="THE FUEL STAYS YOURS" className={styles.goodPanel}>
              <p className={styles.goodText}>
                The {compact(MINT_UNIT)} $UNEST is <strong>not locked</strong>. It is not staked,
                escrowed or transferred anywhere. It remains liquid in your wallet — you can sell it
                the same block. What it does do is back the EGG. See{' '}
                <a href="#backing">Continuous Backing</a>.
              </p>
            </Panel>
          </div>

          <div className={styles.flowCol}>
            <FlowChain
              nodes={[
                { label: 'ETH', note: 'You start here', tone: 'blue' },
                { label: 'UNISWAP V4', note: 'Official pool + UNEST hook', tone: 'plain' },
                { label: '$UNEST', note: `${compact(MINT_UNIT)} per complete unit`, tone: 'yolk' },
                { label: 'SEALED EGG', note: 'Minted by the hook', tone: 'green' },
              ]}
            />
            <Stat
              value={`${compact(MINT_UNIT)} = 1`}
              label="$UNEST PER SEALED EGG"
              hint="Complete units only. Partial amounts carry over."
              className={styles.flowStat}
            />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- 02 */}
      <Section id="step-2" size="md">
        <SectionHeader
          eyebrow="02 — SEALED EGG"
          title="SOMETHING IS GROWING"
          lead={
            <p>
              Every newly created NFT begins as a <strong>SEALED EGG</strong>. Traits remain hidden.
              After approximately <strong>{SEALED_REVEAL_BLOCKS} blocks</strong> the reveal target
              becomes fixed.
            </p>
          }
        />
        <Incubation />

        <StatGrid columns={3} className={styles.statRow}>
          <Stat
            value={`${SEALED_REVEAL_BLOCKS} BLOCKS`}
            label="UNTIL REVEAL TARGET"
            accent="yolk"
          />
          <Stat value="HIDDEN" label="TRAITS BEFORE HATCH" accent="plain" />
          <Stat value="TRANSFERABLE" label="A SEALED EGG IS STILL AN NFT" accent="green" />
        </StatGrid>
      </Section>

      {/* ---------------------------------------------------------------- 03 */}
      <Section id="step-3" tone="sunken" size="md">
        <SectionHeader
          eyebrow="03 — HATCH"
          title="CRACK IT OPEN"
          lead={
            <p>
              Burn <strong>{compact(HATCH_COST)} $UNEST</strong> and the EGG becomes a permanent
              creature. There is no undo.
            </p>
          }
        />
        <HatchSequence />
      </Section>

      {/* ---------------------------------------------------------------- 04 */}
      <Section id="step-4" tone="field" size="md">
        <SectionHeader
          eyebrow="04 — ENERGY"
          title="KEEP IT FED"
          lead={
            <p>
              Energy runs from 0 to 100. It decays. A creature at 0 Energy is{' '}
              <strong>HIBERNATING</strong> and generates nothing at all.
            </p>
          }
        />
        <EnergyLadder />
      </Section>

      {/* ---------------------------------------------------------------- 05 */}
      <Section id="step-5" size="md">
        <SectionHeader
          eyebrow="05 — REWARDS"
          title="THE FARM PRODUCES"
          lead={
            <p>
              Pool fees are split by the fee hook and distributed to active creatures according to{' '}
              <strong>Effective Reward Weight</strong>.
            </p>
          }
        />

        <RewardSplit />

        <div className={styles.formulaBlock}>
          <div className={styles.formulaLine}>
            <span>EFFECTIVE WEIGHT</span>
            <em>=</em>
            <span>REWARD WEIGHT</span>
            <em>×</em>
            <span>ENERGY %</span>
          </div>

          <div className={styles.compare}>
            <div className={styles.compareCard}>
              <span className={styles.compareName}>CREATURE A</span>
              <dl>
                <div>
                  <dt>WEIGHT</dt>
                  <dd>300</dd>
                </div>
                <div>
                  <dt>ENERGY</dt>
                  <dd>100%</dd>
                </div>
                <div>
                  <dt>EFFECTIVE</dt>
                  <dd className={styles.strong}>300</dd>
                </div>
              </dl>
            </div>
            <div className={styles.compareCard}>
              <span className={styles.compareName}>CREATURE B</span>
              <dl>
                <div>
                  <dt>WEIGHT</dt>
                  <dd>300</dd>
                </div>
                <div>
                  <dt>ENERGY</dt>
                  <dd>25%</dd>
                </div>
                <div>
                  <dt>EFFECTIVE</dt>
                  <dd className={styles.weak}>75</dd>
                </div>
              </dl>
            </div>
          </div>

          <p className={styles.noPromise}>
            Identical creatures, different feeding habits, four times the difference in share. This
            is what makes feeding economically meaningful. No APR is displayed anywhere on this site
            because none can be guaranteed — rewards depend entirely on pool activity.
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------------- weight */}
      <Section tone="soil" size="md">
        <SectionHeader
          eyebrow="STATS"
          title="REWARD WEIGHT"
          lead={<p>What a creature is worth before Energy is applied.</p>}
        />
        <RewardWeightPanel />
      </Section>

      {/* -------------------------------------------------------- breeding */}
      <Section id="breeding" size="md">
        <SectionHeader
          eyebrow="BREEDING"
          title="GROW THE NEXT GENERATION"
          lead={
            <p>Two active creatures, both with Energy above zero, can produce a new Sealed EGG.</p>
          }
        />
        <BreedingPanel />
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeader
          eyebrow="BLOODLINE"
          title="EVERY CREATURE HAS A FAMILY"
          lead={<p>Generations, parents, inherited traits and mutations are all on-chain.</p>}
        />
        <Bloodline />
      </Section>

      {/* ------------------------------------------------------- evolution */}
      <Section id="evolution" size="md">
        <SectionHeader
          eyebrow="EVOLUTION"
          title="EVOLVE OR RISK IT"
          lead={<p>A deliberate gamble with a known cost and a known probability.</p>}
        />
        <EvolutionPanel />
      </Section>

      {/* --------------------------------------------------------- backing */}
      <Section id="backing" tone="soil" size="md">
        <SectionHeader
          eyebrow="CONTINUOUS BACKING"
          title="EVERY EGG NEEDS ITS FUEL"
          lead={
            <p>
              Each EGG requires <strong>{compact(BACKING_PER_EGG)} $UNEST</strong> of wallet
              backing. The $UNEST is not locked. It stays liquid. But the wallet balance decides how
              many EGGs that wallet can support.
            </p>
          }
        />

        <ul className={styles.backingExamples}>
          {BACKING_EXAMPLES.map((e) => (
            <li key={e.eggs}>
              <span className={styles.beEggs}>
                {e.eggs} EGG{e.eggs > 1 ? 'S' : ''}
              </span>
              <span className={styles.beArrow} aria-hidden="true">
                ↔
              </span>
              <span className={styles.beUnest}>{grouped(e.unest)} $UNEST</span>
            </li>
          ))}
        </ul>

        <BackingPanel />
      </Section>

      {/* -------------------------------------------------------- flywheel */}
      <Section size="lg">
        <SectionHeader
          eyebrow="THE FLYWHEEL"
          title="IT ALL FEEDS ITSELF"
          align="center"
          lead={
            <p>
              {grouped(THEORETICAL_MAX_EGGS)} EGGs is the ceiling the token math allows. Every burn
              pushes the real number lower.
            </p>
          }
        />
        <Flywheel />

        <div className={styles.footerCta}>
          <Badge tone="yolk">NEXT</Badge>
          <PixelLink href="/hooks" size="lg">
            SEE THE ENGINE
          </PixelLink>
          <PixelLink href="/nest" size="lg" variant="ghost">
            OPEN YOUR NEST
          </PixelLink>
        </div>
      </Section>
    </>
  );
}
