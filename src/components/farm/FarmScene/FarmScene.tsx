import styles from './FarmScene.module.css';

/* -------------------------------------------------------------------------- */
/*  Small pixel primitives                                                    */
/* -------------------------------------------------------------------------- */

interface ShapeProps {
  x: number;
  base: number;
  w: number;
  h: number;
  fill: string;
  step?: number;
}

/** A stepped triangle — the classic pixel mountain. */
function Mountain({ x, base, w, h, fill, step = 3 }: ShapeProps) {
  const rows = Math.max(1, Math.floor(h / step));
  return (
    <g>
      {Array.from({ length: rows }, (_, i) => {
        const t = (i + 1) / rows;
        const rw = Math.max(2, Math.round(w * t));
        const rx = Math.round(x + w / 2 - rw / 2);
        return <rect key={i} x={rx} y={base - h + i * step} width={rw} height={step} fill={fill} />;
      })}
    </g>
  );
}

function Cloud({ x, y, s = 1, fill }: { x: number; y: number; s?: number; fill: string }) {
  const u = (n: number) => Math.round(n * s);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={u(4)} width={u(28)} height={u(5)} fill={fill} />
      <rect x={u(5)} y={u(0)} width={u(13)} height={u(5)} fill={fill} />
      <rect x={u(16)} y={u(2)} width={u(9)} height={u(3)} fill={fill} />
      <rect x={u(3)} y={u(9)} width={u(20)} height={u(2)} fill={fill} opacity={0.55} />
    </g>
  );
}

function Bird({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className={styles.birdFlap}>
      <rect x={0} y={1} width={2} height={1} fill={fill} />
      <rect x={2} y={0} width={1} height={1} fill={fill} />
      <rect x={3} y={1} width={2} height={1} fill={fill} />
    </g>
  );
}

function Tree({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  const u = (n: number) => Math.round(n * s);
  return (
    <g transform={`translate(${x} ${base})`}>
      <rect x={u(5)} y={u(-8)} width={u(3)} height={u(8)} fill="#4b2d1b" />
      <rect x={u(0)} y={u(-16)} width={u(13)} height={u(8)} fill="#3f5f2c" />
      <rect x={u(2)} y={u(-22)} width={u(9)} height={u(6)} fill="#5c8a3d" />
      <rect x={u(4)} y={u(-26)} width={u(5)} height={u(4)} fill="#5c8a3d" />
      <rect x={u(3)} y={u(-20)} width={u(3)} height={u(2)} fill="#7fae54" />
    </g>
  );
}

function Fence({ x, base, segments }: { x: number; base: number; segments: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      {Array.from({ length: segments }, (_, i) => (
        <rect key={i} x={i * 10} y={-11} width={3} height={11} fill="#8d5a38" />
      ))}
      <rect x={0} y={-9} width={segments * 10} height={2} fill="#70452a" />
      <rect x={0} y={-4} width={segments * 10} height={2} fill="#70452a" />
    </g>
  );
}

function Crop({ x, base }: { x: number; base: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      <rect x={1} y={-6} width={1} height={6} fill="#3f5f2c" />
      <rect x={0} y={-8} width={3} height={2} fill="#f4c95d" />
    </g>
  );
}

function Chicken({ x, base, flip = false }: { x: number; base: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${flip ? -1 : 1} 1)`} className={styles.peck}>
      <rect x={0} y={-7} width={7} height={5} fill="#fff1c7" />
      <rect x={5} y={-10} width={4} height={4} fill="#fff1c7" />
      <rect x={8} y={-8} width={2} height={1} fill="#d98c3f" />
      <rect x={7} y={-9} width={1} height={1} fill="#11130f" />
      <rect x={6} y={-11} width={2} height={1} fill="#a94a38" />
      <rect x={1} y={-2} width={1} height={2} fill="#d98c3f" />
      <rect x={4} y={-2} width={1} height={2} fill="#d98c3f" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Structures                                                                */
/* -------------------------------------------------------------------------- */

function Barn({ x, base }: { x: number; base: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      {/* roof */}
      {Array.from({ length: 7 }, (_, i) => {
        const w = 14 + i * 6;
        return (
          <rect
            key={i}
            x={Math.round(26 - w / 2)}
            y={-40 + i * 2}
            width={w}
            height={2}
            fill={i % 2 === 0 ? '#7c3427' : '#8f3c2e'}
          />
        );
      })}
      <rect x={-1} y={-27} width={54} height={2} fill="#4b2d1b" />
      {/* body */}
      <rect x={2} y={-25} width={48} height={25} fill="#a94a38" />
      <rect x={2} y={-25} width={48} height={2} fill="#c05a45" />
      <rect x={2} y={-4} width={48} height={4} fill="#7c3427" />
      {/* plank shadows */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={2 + i * 6} y={-25} width={1} height={25} fill="#8f3c2e" />
      ))}
      {/* white trim + door */}
      <rect x={17} y={-19} width={18} height={19} fill="#4b2d1b" />
      <rect x={18} y={-18} width={16} height={18} fill="#70452a" />
      <rect x={18} y={-18} width={16} height={1} fill="#fff1c7" opacity={0.5} />
      <rect x={25} y={-18} width={2} height={18} fill="#4b2d1b" />
      <rect x={18} y={-10} width={16} height={1} fill="#4b2d1b" />
      {/* hay loft window */}
      <rect x={22} y={-33} width={8} height={7} fill="#3a2214" />
      <rect x={23} y={-32} width={6} height={5} fill="#f4c95d" className={styles.lamp} />
      {/* side windows */}
      <rect x={7} y={-21} width={6} height={5} fill="#3a2214" />
      <rect x={8} y={-20} width={4} height={3} fill="#f4c95d" opacity={0.85} />
      <rect x={39} y={-21} width={6} height={5} fill="#3a2214" />
      <rect x={40} y={-20} width={4} height={3} fill="#f4c95d" opacity={0.85} />
    </g>
  );
}

function Coop({ x, base }: { x: number; base: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const w = 8 + i * 5;
        return (
          <rect
            key={i}
            x={Math.round(14 - w / 2)}
            y={-24 + i * 2}
            width={w}
            height={2}
            fill={i % 2 === 0 ? '#4b2d1b' : '#5e3721'}
          />
        );
      })}
      <rect x={2} y={-14} width={24} height={14} fill="#70452a" />
      <rect x={2} y={-14} width={24} height={1} fill="#8d5a38" />
      <rect x={10} y={-9} width={8} height={9} fill="#231409" />
      <rect x={11} y={-8} width={6} height={8} fill="#3a2214" />
      {/* ramp */}
      <rect x={18} y={-2} width={10} height={2} fill="#8d5a38" />
      {/* straw */}
      <rect x={0} y={-1} width={30} height={1} fill="#d9b45e" opacity={0.6} />
    </g>
  );
}

function Windmill({ x, base }: { x: number; base: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      {/* tower */}
      {Array.from({ length: 12 }, (_, i) => {
        const w = 6 + i;
        return (
          <rect
            key={i}
            x={Math.round(9 - w / 2)}
            y={-4 - (12 - i) * 3}
            width={w}
            height={3}
            fill={i % 2 === 0 ? '#8d5a38' : '#70452a'}
          />
        );
      })}
      <rect x={0} y={-4} width={18} height={4} fill="#4b2d1b" />
      {/* cap */}
      <rect x={4} y={-43} width={10} height={4} fill="#7c3427" />
      <rect x={6} y={-46} width={6} height={3} fill="#7c3427" />
      {/* blades */}
      <g transform="translate(9 -38)" className={styles.blades}>
        {[0, 90, 180, 270].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            <rect x={-1} y={-26} width={2} height={22} fill="#e7d3b1" />
            <rect x={1} y={-26} width={4} height={12} fill="#c9b183" />
          </g>
        ))}
        <rect x={-2} y={-2} width={4} height={4} fill="#4b2d1b" />
      </g>
    </g>
  );
}

function NestSpot({ x, base }: { x: number; base: number }) {
  return (
    <g transform={`translate(${x} ${base})`}>
      <rect x={0} y={-4} width={22} height={4} fill="#8b5f1c" />
      <rect x={2} y={-6} width={18} height={2} fill="#a8762a" />
      <rect x={-2} y={-2} width={26} height={2} fill="#70452a" />
      <rect x={4} y={-8} width={3} height={2} fill="#d9b45e" />
      <rect x={14} y={-8} width={4} height={2} fill="#d9b45e" />
      {/* two small eggs resting in the nest */}
      <rect x={6} y={-10} width={4} height={4} fill="#fff1c7" />
      <rect x={11} y={-9} width={4} height={3} fill="#f4c95d" />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene                                                                     */
/* -------------------------------------------------------------------------- */

export interface FarmSceneProps {
  className?: string;
  /** Hides the most expensive decorative layers on small screens. */
  variant?: 'full' | 'simple';
}

const HORIZON = 128;
const W = 320;
const H = 180;

export function FarmScene({ className, variant = 'full' }: FarmSceneProps) {
  const full = variant === 'full';

  return (
    <svg
      className={[styles.scene, className].filter(Boolean).join(' ')}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="unestSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2340" />
          <stop offset="42%" stopColor="#4a3a5c" />
          <stop offset="72%" stopColor="#a3603f" />
          <stop offset="100%" stopColor="#d98c3f" />
        </linearGradient>
        <linearGradient id="unestField" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f5f2c" />
          <stop offset="100%" stopColor="#263a24" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x={0} y={0} width={W} height={HORIZON} fill="url(#unestSky)" />

      {/* stars */}
      {full &&
        [
          [18, 12],
          [46, 26],
          [82, 9],
          [120, 21],
          [201, 14],
          [246, 8],
          [289, 24],
          [305, 40],
        ].map(([sx, sy], i) => (
          <rect
            key={i}
            x={sx}
            y={sy}
            width={1}
            height={1}
            fill="#fff1c7"
            opacity={0.65}
            className={styles.star}
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}

      {/* sun */}
      <g className={styles.sun}>
        <rect x={236} y={54} width={22} height={22} fill="#f4c95d" />
        <rect x={232} y={58} width={30} height={14} fill="#f4c95d" />
        <rect x={240} y={50} width={14} height={30} fill="#f4c95d" />
        <rect x={240} y={58} width={10} height={10} fill="#ffeaa8" />
      </g>

      {/* mountains */}
      <Mountain x={-10} base={HORIZON} w={110} h={54} fill="#2f3a4e" step={3} />
      <Mountain x={64} base={HORIZON} w={130} h={70} fill="#38445a" step={3} />
      <Mountain x={186} base={HORIZON} w={150} h={48} fill="#2f3a4e" step={3} />

      {/* clouds */}
      {full && (
        <g>
          <g className={styles.cloudA}>
            <Cloud x={-40} y={22} s={1.15} fill="#e7d3b1" />
          </g>
          <g className={styles.cloudB}>
            <Cloud x={-40} y={48} s={0.85} fill="#cbb896" />
          </g>
          <g className={styles.cloudC}>
            <Cloud x={-40} y={12} s={0.7} fill="#f4e2bd" />
          </g>
        </g>
      )}

      {/* birds */}
      {full && (
        <g className={styles.flock}>
          <Bird x={0} y={34} fill="#241a06" />
          <Bird x={9} y={30} fill="#241a06" />
          <Bird x={17} y={37} fill="#241a06" />
        </g>
      )}

      {/* field */}
      <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill="url(#unestField)" />
      <rect x={0} y={HORIZON} width={W} height={2} fill="#5c8a3d" />
      <rect x={0} y={HORIZON + 12} width={W} height={1} fill="#4a7233" opacity={0.6} />
      <rect x={0} y={HORIZON + 28} width={W} height={1} fill="#35552a" opacity={0.6} />

      {/* soil rows */}
      {Array.from({ length: 4 }, (_, i) => (
        <rect
          key={i}
          x={0}
          y={H - 22 + i * 5}
          width={W}
          height={2}
          fill="#4b2d1b"
          opacity={0.35 + i * 0.12}
        />
      ))}

      {/* structures */}
      <Tree x={4} base={HORIZON + 6} s={1} />
      {full && <Tree x={286} base={HORIZON + 4} s={0.85} />}
      <Coop x={22} base={HORIZON + 18} />
      <Barn x={112} base={HORIZON + 22} />
      <Windmill x={246} base={HORIZON + 16} />

      {/* fences */}
      <Fence x={0} base={H - 4} segments={9} />
      {full && <Fence x={228} base={HORIZON + 16} segments={7} />}

      {/* crops */}
      {full && Array.from({ length: 14 }, (_, i) => <Crop key={i} x={90 + i * 9} base={H - 6} />)}

      {/* nest + chickens */}
      <NestSpot x={196} base={HORIZON + 26} />
      <Chicken x={72} base={HORIZON + 20} />
      {full && <Chicken x={178} base={H - 10} flip />}
      {full && <Chicken x={252} base={HORIZON + 30} />}

      {/* dusk haze over the field */}
      <rect x={0} y={HORIZON} width={W} height={H - HORIZON} fill="#11130f" opacity={0.18} />
    </svg>
  );
}

export default FarmScene;
