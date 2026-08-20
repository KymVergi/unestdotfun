import type { ReactNode } from 'react';
import styles from './Section.module.css';

export interface SectionProps {
  children: ReactNode;
  id?: string;
  /** 'wide' widens the container, 'narrow' is for reading-heavy content. */
  width?: 'narrow' | 'default' | 'wide';
  tone?: 'plain' | 'sunken' | 'soil' | 'field';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Section({
  children,
  id,
  width = 'default',
  tone = 'plain',
  size = 'md',
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      className={[styles.section, styles[tone], styles[size], className].filter(Boolean).join(' ')}
    >
      <div className={[styles.container, styles[width]].join(' ')}>{children}</div>
    </section>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className={styles.pageHero}>
      <div className={[styles.container, styles.default].join(' ')}>
        {eyebrow ? <span className={styles.pageEyebrow}>{eyebrow}</span> : null}
        <h1 className={styles.pageTitle}>{title}</h1>
        {lead ? <div className={styles.pageLead}>{lead}</div> : null}
        {children}
      </div>
      <span className={styles.horizon} aria-hidden="true" />
    </section>
  );
}

export default Section;
