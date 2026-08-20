import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import Badge from '@/components/pixel/Badge/Badge';
import SectionHeader from '@/components/pixel/SectionHeader/SectionHeader';
import GalleryGrid from '@/components/gallery/GalleryGrid/GalleryGrid';
import { TRAIT_CATEGORIES, TRAIT_VALUES } from '@/config/protocol';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'The UNEST pixel gallery: every creature, every trait, sortable by id, rarity, weight, generation and energy.',
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="THE COOP"
        title="GALLERY"
        lead={
          <p>
            One pixel universe, one trait system, one visual DNA. Every creature here is generated
            from its own EGG id, so what you see is what the contract will describe.
          </p>
        }
      >
        <div className={styles.badges}>
          <Badge tone="muted">ONE VISUAL DNA</Badge>
          <Badge tone="muted">GENERATED FROM THE EGG ID</Badge>
        </div>
      </PageHero>

      <Section width="wide" size="md">
        <GalleryGrid />
      </Section>

      <Section tone="soil" size="md">
        <SectionHeader
          eyebrow="TRAIT SYSTEM"
          title="WHAT MAKES A CREATURE"
          lead={
            <p>
              Hatching writes six to seven permanent traits drawn from these categories, plus
              rarity, Reward Weight and visual DNA.
            </p>
          }
        />

        <div className={styles.traits}>
          {TRAIT_CATEGORIES.map((cat) => (
            <div key={cat} className={styles.traitCard}>
              <span className={styles.traitName}>{cat}</span>
              <ul>
                {TRAIT_VALUES[cat].map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
