import type { ReactNode } from 'react';
import styles from './FlowChain.module.css';

export interface FlowNode {
  label: string;
  note?: string;
  tone?: 'plain' | 'yolk' | 'green' | 'barn' | 'blue';
  icon?: ReactNode;
}

export interface FlowChainProps {
  nodes: FlowNode[];
  direction?: 'row' | 'column';
  className?: string;
  /** Animates a pixel packet travelling down the chain. */
  animated?: boolean;
}

export function FlowChain({
  nodes,
  direction = 'column',
  className,
  animated = true,
}: FlowChainProps) {
  return (
    <ol
      className={[styles.chain, styles[direction], animated ? styles.animated : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {nodes.map((node, i) => (
        <li key={node.label} className={styles.item}>
          <div
            className={[styles.node, styles[node.tone ?? 'plain']].join(' ')}
            style={{ animationDelay: `${i * 0.28}s` }}
          >
            {node.icon ? (
              <span className={styles.icon} aria-hidden="true">
                {node.icon}
              </span>
            ) : null}
            <span className={styles.label}>{node.label}</span>
            {node.note ? <span className={styles.note}>{node.note}</span> : null}
          </div>
          {i < nodes.length - 1 ? (
            <span className={styles.arrow} aria-hidden="true">
              <svg viewBox="0 0 9 12" shapeRendering="crispEdges">
                <rect x={4} y={0} width={1} height={7} fill="currentColor" />
                <rect x={2} y={7} width={5} height={1} fill="currentColor" />
                <rect x={3} y={8} width={3} height={1} fill="currentColor" />
                <rect x={4} y={9} width={1} height={1} fill="currentColor" />
              </svg>
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default FlowChain;
