import Link from 'next/link';
import { LINKS, NETWORK_NAME } from '@/config/contracts';
import { SOCIAL_LINKS } from '@/config/site';
import { SLOGAN_PRIMARY } from '@/config/protocol';
import styles from './Footer.module.css';

const COLUMNS = [
  {
    title: 'THE NEST',
    links: [
      { label: 'PROTOCOL', href: '/protocol' },
      { label: 'NEST', href: '/nest' },
      { label: 'CREATURES', href: '/creatures' },
      { label: 'GALLERY', href: '/gallery' },
    ],
  },
  {
    title: 'THE ENGINE',
    links: [
      { label: 'HOOKS', href: '/hooks' },
      { label: 'CONTRACTS', href: '/contracts' },
      { label: 'DOCS', href: '/docs' },
      { label: 'FAQ', href: '/docs#faq' },
    ],
  },
] as const;

const EXTERNAL = [
  ...SOCIAL_LINKS,
  { label: 'ETHERSCAN', href: LINKS.etherscan },
  { label: 'UNISWAP', href: LINKS.uniswap },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* the barn roofline sits on top of the whole footer */}
      <div className={styles.roof} aria-hidden="true">
        <svg viewBox="0 0 320 22" preserveAspectRatio="none" shapeRendering="crispEdges">
          {Array.from({ length: 7 }, (_, i) => (
            <rect
              key={i}
              x={0}
              y={i * 3}
              width={320}
              height={3}
              fill={i % 2 === 0 ? '#7c3427' : '#8f3c2e'}
              opacity={0.15 + i * 0.12}
            />
          ))}
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <span className={styles.logo}>UNEST</span>
          <p className={styles.tag}>{SLOGAN_PRIMARY}</p>
          <dl className={styles.assets}>
            <div>
              <dt>$UNEST</dt>
              <dd>ERC-20 · the fuel</dd>
            </div>
            <div>
              <dt>EGG</dt>
              <dd>ERC-721 · the creature</dd>
            </div>
            <div>
              <dt>NEST</dt>
              <dd>the economy</dd>
            </div>
            <div>
              <dt>HOOKS</dt>
              <dd>the engine</dd>
            </div>
          </dl>
        </div>

        <div className={styles.cols}>
          {COLUMNS.map((col) => (
            <nav key={col.title} className={styles.col} aria-label={col.title}>
              <h2 className={styles.colTitle}>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav className={styles.col} aria-label="External">
            <h2 className={styles.colTitle}>OUTSIDE</h2>
            <ul>
              {EXTERNAL.map((l) => (
                <li key={l.label}>
                  <a
                    className={styles.link}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* fence line */}
      <div className={styles.fence} aria-hidden="true">
        <svg viewBox="0 0 320 14" preserveAspectRatio="none" shapeRendering="crispEdges">
          {Array.from({ length: 32 }, (_, i) => (
            <rect key={i} x={i * 10} y={0} width={3} height={14} fill="#8d5a38" />
          ))}
          <rect x={0} y={3} width={320} height={2} fill="#70452a" />
          <rect x={0} y={9} width={320} height={2} fill="#70452a" />
        </svg>
      </div>

      <div className={styles.bottom}>
        <p className={styles.legal}>
          BUILT FOR THE NEST. · {NETWORK_NAME} · $UNEST is the token, EGG is the NFT. ·{' '}
          <Link href="/legal" className={styles.legalLink}>
            TERMS &amp; RISK
          </Link>
        </p>
        <p className={styles.disclaimer}>
          Nothing here is financial advice. No returns are promised or guaranteed. Always verify the
          contracts yourself before interacting with the protocol.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
