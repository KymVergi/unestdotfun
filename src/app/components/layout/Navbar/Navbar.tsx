'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/pixel/Icon/Icon';
import ConnectWallet from '@/components/web3/ConnectWallet/ConnectWallet';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'HOME' },
  { href: '/protocol', label: 'PROTOCOL' },
  { href: '/nest', label: 'NEST' },
  { href: '/creatures', label: 'CREATURES' },
  { href: '/gallery', label: 'GALLERY' },
  { href: '/hooks', label: 'HOOKS' },
  { href: '/contracts', label: 'CONTRACTS' },
  { href: '/docs', label: 'DOCS' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className={[styles.navbar, scrolled ? styles.scrolled : ''].join(' ')}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="UNEST — home">
          <span className={styles.brandEgg} aria-hidden="true">
            <svg viewBox="0 0 8 10" shapeRendering="crispEdges">
              <rect x={3} y={0} width={2} height={1} fill="#4b2d1b" />
              <rect x={2} y={1} width={4} height={1} fill="#fff1c7" />
              <rect x={1} y={2} width={6} height={4} fill="#fff1c7" />
              <rect x={1} y={6} width={6} height={2} fill="#f4c95d" />
              <rect x={2} y={8} width={4} height={1} fill="#c9b183" />
              <rect x={2} y={2} width={1} height={2} fill="#fffcef" />
            </svg>
          </span>
          <span className={styles.brandText}>UNEST</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          <ul className={styles.list}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[styles.link, isActive(item.href) ? styles.active : ''].join(' ')}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.right}>
          <div className={styles.walletDesktop}>
            <ConnectWallet />
          </div>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="unest-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <Icon name={open ? 'close' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      <span className={styles.grain} aria-hidden="true" />

      <div
        id="unest-mobile-menu"
        className={[styles.mobileMenu, open ? styles.menuOpen : ''].join(' ')}
        hidden={!open}
      >
        <ul className={styles.mobileList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[styles.mobileLink, isActive(item.href) ? styles.active : ''].join(' ')}
                onClick={() => setOpen(false)}
              >
                <span className={styles.cursor} aria-hidden="true">
                  ▸
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.mobileWallet}>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
