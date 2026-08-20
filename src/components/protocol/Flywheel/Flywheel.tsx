import { LOOP_STEPS } from '@/config/protocol';
import styles from './Flywheel.module.css';

const RADIUS = 41; // % of the container

/**
 * The Farm's flywheel, drawn as a windmill: the loop turns, the sails turn,
 * the Nest grows. Steps are laid out mathematically so the ring stays exact.
 */
export function Flywheel() {
  const n = LOOP_STEPS.length;

  return (
    <div className={styles.wrap}>
      <div className={styles.ring} role="list" aria-label="The UNEST loop">
        {/* rails */}
        <span className={styles.rail} aria-hidden="true" />
        <span className={styles.railInner} aria-hidden="true" />

        {/* windmill hub */}
        <div className={styles.hub}>
          <svg viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden="true">
            <g className={styles.sails} transform="translate(32 32)">
              {[0, 90, 180, 270].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <rect x={-2} y={-28} width={4} height={24} fill="#e7d3b1" />
                  <rect x={2} y={-28} width={7} height={13} fill="#c9b183" />
                  <rect x={-2} y={-28} width={4} height={2} fill="#8b5f1c" />
                </g>
              ))}
              <rect x={-4} y={-4} width={8} height={8} fill="#4b2d1b" />
              <rect x={-2} y={-2} width={4} height={4} fill="#f4c95d" />
            </g>
          </svg>
          <span className={styles.hubLabel}>THE FARM</span>
          <span className={styles.hubSub}>KEEPS TURNING</span>
        </div>

        {LOOP_STEPS.map((step, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const left = 50 + Math.cos(angle) * RADIUS;
          const top = 50 + Math.sin(angle) * RADIUS;
          return (
            <div
              key={step}
              role="listitem"
              className={styles.node}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${(i / n) * 3.2}s`,
              }}
            >
              <span className={styles.nodeIndex}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.nodeLabel}>{step}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile: the same loop, read top to bottom. */}
      <ol className={styles.list}>
        {LOOP_STEPS.map((step, i) => (
          <li key={step} className={styles.listItem}>
            <span className={styles.listIndex}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.listLabel}>{step}</span>
          </li>
        ))}
        <li className={[styles.listItem, styles.listLoop].join(' ')}>
          <span className={styles.listIndex}>↻</span>
          <span className={styles.listLabel}>BACK TO BUY $UNEST</span>
        </li>
      </ol>
    </div>
  );
}

export default Flywheel;
