import Hero from '@/components/hero/Hero/Hero';
import Section from '@/components/layout/Section/Section';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import LoopStrip from '@/components/protocol/LoopStrip/LoopStrip';
import AssetPanel from '@/components/protocol/AssetPanel/AssetPanel';
import RewardSplit from '@/components/protocol/RewardSplit/RewardSplit';
import Flywheel from '@/components/protocol/Flywheel/Flywheel';
import TokenSinks from '@/components/protocol/TokenSinks/TokenSinks';
import Scarcity from '@/components/protocol/Scarcity/Scarcity';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import PixelCreature from '@/components/pixel/PixelCreature/PixelCreature';
import Panel from '@/components/pixel/Panel/Panel';
import { SLOGAN_ALT_3 } from '@/config/protocol';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section tone="soil" size="md">
        <SectionHeader
          eyebrow="THE LOOP"
          title="BUY. HATCH. FEED. BREED."
          lead={
            <p>
              <strong>$UNEST</strong> is the ERC-20 token that fuels everything.{' '}
              <strong>EGG</strong> is the ERC-721 creature it produces. Nothing else in the Farm
              moves without those two.
            </p>
          }
        />
        <LoopStrip />
      </Section>

      <Section size="md">
        <SectionHeader
          eyebrow="THE ASSETS"
          title="ONE TOKEN. ONE CREATURE. ONE GATE."
          lead={
            <p>
              Three things and only three things. Confuse them and nothing about the economy makes
              sense.
            </p>
          }
        />
        <AssetPanel />
      </Section>

      <Section tone="field" size="md">
        <div className={styles.split}>
          <div>
            <SectionHeader
              eyebrow="THE FARM PRODUCES"
              title="FEES FLOW TO WHOEVER IS AWAKE"
              lead={
                <p>
                  Pool fees are routed by the hook. Active creatures take the overwhelming majority
                  — but only in proportion to their <strong>Effective Reward Weight</strong>.
                </p>
              }
            />
            <RewardSplit />
          </div>

          <Panel title="EFFECTIVE REWARD WEIGHT" tone="terminal" className={styles.formulaPanel}>
            <p className={styles.formula}>
              <span>EFFECTIVE WEIGHT</span>
              <em>=</em>
              <span>REWARD WEIGHT</span>
              <em>×</em>
              <span>ENERGY %</span>
            </p>

            <div className={styles.example}>
              <div className={styles.exampleRow}>
                <PixelCreature id={12} className={styles.exampleArt} idle={false} />
                <div>
                  <span className={styles.exampleName}>CREATURE A</span>
                  <span className={styles.exampleMeta}>WEIGHT 300 · ENERGY 100%</span>
                </div>
                <span className={styles.exampleValue}>300</span>
              </div>
              <div className={styles.exampleRow}>
                <PixelCreature id={29} className={styles.exampleArt} idle={false} />
                <div>
                  <span className={styles.exampleName}>CREATURE B</span>
                  <span className={styles.exampleMeta}>WEIGHT 300 · ENERGY 25%</span>
                </div>
                <span className={[styles.exampleValue, styles.exampleWeak].join(' ')}>75</span>
              </div>
            </div>

            <p className={styles.disclaimer}>
              Same weight, quarter the energy, quarter the share. Feeding is not decoration — it is
              the whole point. No return is promised or implied.
            </p>
          </Panel>
        </div>
      </Section>

      <Section size="lg">
        <SectionHeader
          eyebrow="THE FLYWHEEL"
          title="THE WINDMILL NEVER STOPS"
          align="center"
          lead={<p>Every action feeds the next one. Every burn tightens the supply.</p>}
        />
        <Flywheel />
      </Section>

      <Section tone="sunken" size="md">
        <SectionHeader
          eyebrow="TOKEN SINKS"
          title="$UNEST GETS CONSUMED"
          lead={
            <p>
              The Farm runs on fuel and the fuel is spent. This is where <strong>$UNEST</strong>{' '}
              leaves circulation.
            </p>
          }
        />
        <TokenSinks />
      </Section>

      <Section size="md">
        <SectionHeader
          eyebrow="SCARCITY"
          title="2,000 IS ONLY THE LIMIT"
          lead={
            <p>
              The theoretical maximum is a division, not a promise. The real number of EGGs can only
              go lower.
            </p>
          }
        />
        <Scarcity />
      </Section>

      <Section tone="soil" size="lg">
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>FEED THE NEST.</h2>
          <p className={styles.ctaLead}>{SLOGAN_ALT_3}</p>
          <div className={styles.ctaActions}>
            <PixelLink href="/nest" size="lg">
              ENTER THE NEST
            </PixelLink>
            <PixelLink href="/hooks" size="lg" variant="secondary">
              SEE THE ENGINE
            </PixelLink>
            <PixelLink href="/contracts" size="lg" variant="ghost">
              VERIFY CONTRACTS
            </PixelLink>
          </div>
        </div>
      </Section>
    </>
  );
}
