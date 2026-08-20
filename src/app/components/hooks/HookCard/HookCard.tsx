import type { ReactNode } from 'react';
import styles from './HookCard.module.css';

export interface HookCardProps {
  index: string;
  title: string;
  summary: string;
  responsibilities?: string[];
  children?: ReactNode;
  icon?: ReactNode;
  tone?: 'yolk' | 'green' | 'barn' | 'blue' | 'purple';
  id?: string;
}

export function HookCard({
  index,
  title,
  summary,
  responsibilities,
  children,
  icon,
  tone = 'yolk',
  id,
}: HookCardProps) {
  return (
    <article id={id} className={[styles.card, styles[tone]].join(' ')}>
      <header className={styles.head}>
        <span className={styles.index}>{index}</span>
        {icon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <h3 className={styles.title}>{title}</h3>
      </header>

      <p className={styles.summary}>{summary}</p>

      {responsibilities?.length ? (
        <ul className={styles.list}>
          {responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : null}

      {children ? <div className={styles.body}>{children}</div> : null}

      <span className={styles.scan} aria-hidden="true" />
    </article>
  );
}

export default HookCard;
