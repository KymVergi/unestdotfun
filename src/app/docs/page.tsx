import type { Metadata } from 'next';
import Section, { PageHero } from '@/components/layout/Section/Section';
import Badge from '@/components/pixel/Badge/Badge';
import DocsNav from '@/components/docs/DocsNav/DocsNav';
import { PixelLink } from '@/components/pixel/PixelButton/PixelButton';
import { DOC_SECTIONS, FAQ, type DocBlock } from '@/lib/data/docs';
import { NETWORK_NAME } from '@/config/contracts';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'The full UNEST documentation: token, EGG, minting, hatching, energy, rewards, breeding, evolution, backing, burns, hooks, contracts, security and FAQ.',
};

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items?.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case 'code':
      return <pre className={styles.code}>{block.text}</pre>;
    case 'note':
      return (
        <aside className={[styles.callout, styles.note].join(' ')}>
          <span className={styles.calloutTag}>NOTE</span>
          <p>{block.text}</p>
        </aside>
      );
    case 'warn':
      return (
        <aside className={[styles.callout, styles.warn].join(' ')}>
          <span className={styles.calloutTag}>IMPORTANT</span>
          <p>{block.text}</p>
        </aside>
      );
    default:
      return <p className={styles.p}>{block.text}</p>;
  }
}

export default function DocsPage() {
  const navItems = [
    ...DOC_SECTIONS.map((s) => ({ id: s.id, index: s.index, title: s.title })),
    { id: 'faq', index: '16', title: 'FAQ' },
  ];

  return (
    <>
      <PageHero
        eyebrow="DOCUMENTATION"
        title="THE MANUAL"
        lead={
          <p>
            Every rule of the protocol, written plainly. If something on the Farm contradicts this
            page, this page is what the contracts are meant to do — and the contracts are what you
            should verify.
          </p>
        }
      >
        <div className={styles.badges}>
          <Badge tone="live" dot>
            {NETWORK_NAME}
          </Badge>
          <Badge tone="yolk">16 SECTIONS</Badge>
        </div>
      </PageHero>

      <Section width="wide" size="md">
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <DocsNav items={navItems} />
          </aside>

          <div className={styles.content}>
            <div className={styles.terminalBar}>
              <span className={styles.termDot} />
              <span className={styles.termText}>UNEST://docs</span>
              <span className={styles.caret} aria-hidden="true">
                _
              </span>
            </div>

            {DOC_SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className={styles.section}>
                <header className={styles.sectionHead}>
                  <span className={styles.sectionIndex}>{section.index}</span>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                </header>
                <div className={styles.blocks}>
                  {section.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                  ))}
                </div>
              </section>
            ))}

            <section id="faq" className={styles.section}>
              <header className={styles.sectionHead}>
                <span className={styles.sectionIndex}>16</span>
                <h2 className={styles.sectionTitle}>FAQ</h2>
              </header>

              <div className={styles.faq}>
                {FAQ.map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>
                      <span className={styles.faqMark} aria-hidden="true">
                        ▸
                      </span>
                      {item.q}
                    </summary>
                    <p className={styles.faqA}>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <div className={styles.footer}>
              <p className={styles.footerNote}>
                This documentation describes intended protocol behaviour. It is not a guarantee of
                outcomes, a promise of returns, or a substitute for reading the contracts.
              </p>
              <div className={styles.footerActions}>
                <PixelLink href="/contracts" size="md">
                  VERIFY CONTRACTS
                </PixelLink>
                <PixelLink href="/protocol" size="md" variant="ghost">
                  SEE IT VISUALLY
                </PixelLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
