import type { ReactNode } from 'react';
import styles from './Panel.module.css';

export type PanelTone = 'default' | 'wood' | 'barn' | 'green' | 'terminal';

export interface PanelProps {
  children: ReactNode;
  /** Small uppercase label rendered into the top border, like a game window. */
  title?: string;
  meta?: ReactNode;
  tone?: PanelTone;
  className?: string;
  bodyClassName?: string;
  id?: string;
}

const toneClass: Record<PanelTone, string> = {
  default: styles.toneDefault,
  wood: styles.toneWood,
  barn: styles.toneBarn,
  green: styles.toneGreen,
  terminal: styles.toneTerminal,
};

/** The universal pixel window used across the whole Farm. */
export function Panel({
  children,
  title,
  meta,
  tone = 'default',
  className,
  bodyClassName,
  id,
}: PanelProps) {
  return (
    <section
      id={id}
      className={[styles.panel, toneClass[tone], className].filter(Boolean).join(' ')}
    >
      {(title || meta) && (
        <header className={styles.head}>
          {title ? <h3 className={styles.title}>{title}</h3> : <span />}
          {meta ? <div className={styles.meta}>{meta}</div> : null}
        </header>
      )}
      <div className={[styles.body, bodyClassName].filter(Boolean).join(' ')}>{children}</div>
    </section>
  );
}

export default Panel;
