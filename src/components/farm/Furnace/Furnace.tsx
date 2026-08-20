import styles from './Furnace.module.css';

export interface FurnaceProps {
  className?: string;
  /** 'idle' burns gently, 'hot' burns hard. */
  intensity?: 'idle' | 'hot';
  label?: string;
}

/**
 * The pixel furnace. Wherever $UNEST is consumed, this is what consumes it.
 */
export function Furnace({ className, intensity = 'idle', label }: FurnaceProps) {
  return (
    <div className={[styles.wrap, className].filter(Boolean).join(' ')}>
      <svg
        viewBox="0 0 40 44"
        shapeRendering="crispEdges"
        className={styles.svg}
        role="img"
        aria-label={label ?? 'Pixel furnace burning $UNEST'}
      >
        {/* chimney */}
        <rect x={24} y={0} width={7} height={9} fill="#4b2d1b" />
        <rect x={23} y={2} width={9} height={2} fill="#3a2214" />
        {/* body */}
        <rect x={4} y={9} width={32} height={31} fill="#70452a" />
        <rect x={4} y={9} width={32} height={2} fill="#8d5a38" />
        <rect x={4} y={38} width={32} height={2} fill="#3a2214" />
        <rect x={2} y={40} width={36} height={4} fill="#4b2d1b" />
        {/* brick lines */}
        {[14, 20, 26, 32].map((y) => (
          <rect key={y} x={4} y={y} width={32} height={1} fill="#5e3721" />
        ))}
        {/* mouth */}
        <rect x={10} y={16} width={20} height={18} fill="#231409" />
        <rect x={11} y={17} width={18} height={16} fill="#3a1a08" />
        {/* fire */}
        <g className={intensity === 'hot' ? styles.fireHot : styles.fire}>
          <rect x={12} y={26} width={16} height={7} fill="#a94a38" />
          <rect x={14} y={22} width={12} height={5} fill="#d98c3f" />
          <rect x={16} y={19} width={8} height={4} fill="#f4c95d" />
          <rect x={18} y={17} width={4} height={3} fill="#fff1c7" />
        </g>
        {/* grate */}
        {[13, 17, 21, 25].map((x) => (
          <rect key={x} x={x} y={33} width={1} height={2} fill="#11130f" />
        ))}
      </svg>

      <span className={styles.smoke} aria-hidden="true">
        <i style={{ animationDelay: '0s' }} />
        <i style={{ animationDelay: '0.9s' }} />
        <i style={{ animationDelay: '1.7s' }} />
      </span>

      <span className={styles.embers} aria-hidden="true">
        <i style={{ left: '38%', animationDelay: '0.2s' }} />
        <i style={{ left: '48%', animationDelay: '1.1s' }} />
        <i style={{ left: '58%', animationDelay: '1.9s' }} />
      </span>
    </div>
  );
}

export default Furnace;
