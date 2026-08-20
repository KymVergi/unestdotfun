import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  /** Small kicker above the title, e.g. "03 — HATCH". */
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: Tag = 'h2',
  className,
  id,
}: SectionHeaderProps) {
  return (
    <header
      id={id}
      className={[styles.header, align === 'center' ? styles.center : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <Tag className={styles.title}>{title}</Tag>
      {lead ? <div className={styles.lead}>{lead}</div> : null}
      <span className={styles.rule} aria-hidden="true" />
    </header>
  );
}

export default SectionHeader;
