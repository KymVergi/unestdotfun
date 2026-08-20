import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'live' | 'yolk' | 'green' | 'barn' | 'muted' | 'info';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Renders a blinking pixel dot before the label. */
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, tone = 'muted', dot = false, className, style }: BadgeProps) {
  return (
    <span
      className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}
      style={style}
    >
      {dot ? <span className={styles.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export default Badge;
