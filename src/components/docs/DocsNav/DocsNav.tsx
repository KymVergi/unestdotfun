'use client';

import { useEffect, useState } from 'react';
import styles from './DocsNav.module.css';

export interface DocsNavItem {
  id: string;
  index: string;
  title: string;
}

export function DocsNav({ items }: { items: DocsNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.nav} aria-label="Documentation sections">
      <span className={styles.head}>
        <span className={styles.dot} aria-hidden="true" />
        INDEX
      </span>
      <ol className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[styles.link, active === item.id ? styles.active : ''].join(' ')}
            >
              <span className={styles.idx}>{item.index}</span>
              <span className={styles.title}>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default DocsNav;
