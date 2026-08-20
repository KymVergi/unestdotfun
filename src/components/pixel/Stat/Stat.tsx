import type { ReactNode } from 'react';
import styles from './Stat.module.css';

export interface StatProps {
  value: ReactNode;
  label: string;
  hint?: string;
  accent?: 'yolk' | 'green' | 'barn' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Stat({ value, label, hint, accent = 'yolk', size = 'md', className }: StatProps) {
  return (
    <div
      className={[styles.stat, styles[accent], styles[size], className].filter(Boolean).join(' ')}
    >
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}

export interface StatGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
}

export function StatGrid({ children, columns = 3, className }: StatGridProps) {
  return (
    <div
      className={[styles.grid, className].filter(Boolean).join(' ')}
      style={{ '--cols': columns } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export default Stat;
