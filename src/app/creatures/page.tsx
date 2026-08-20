import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import Badge from '@/components/pixel/Badge/Badge';
import CreatureExplorer from '@/components/creatures/CreatureExplorer/CreatureExplorer';
import RewardWeightPanel from '@/components/creatures/RewardWeightPanel/RewardWeightPanel';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import { REWARD_WEIGHT_BASE, REWARD_WEIGHT_CAP } from '@/config/protocol';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Creatures',
  description:
    'Browse the UNEST creature population: rarity, energy, reward weight, generation, traits, breeds and evolutions.',
};

export default function CreaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="THE POPULATION"
        title="CREATURES"
        lead={
          <p>
            Every hatched EGG is a living economic asset: it consumes <strong>$UNEST</strong>,
            produces rewards while it is awake, and can breed and evolve. This is what the Farm is
            actually made of.
          </p>
        }
      >
        <div className={styles.badges}>
          <Badge tone="muted">DETERMINISTIC PIXEL DNA</Badge>
          <Badge tone="muted">SAME ART AS THE METADATA API</Badge>
        </div>
      </PageHero>

      <Section size="md">
        <CreatureExplorer />
      </Section>

      <Section tone="soil" size="md">
        <SectionHeader
          eyebrow="HOW WEIGHT IS BUILT"
          title="FROM BASE TO CAP"
          lead={
            <p>
              Reward Weight starts at {REWARD_WEIGHT_BASE}, gains a rarity bonus, and is capped at{' '}
              {REWARD_WEIGHT_CAP}. Energy decides how much of it counts.
            </p>
          }
        />
        <RewardWeightPanel />
      </Section>
    </>
  );
}
