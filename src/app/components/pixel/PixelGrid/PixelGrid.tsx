import { toRuns, type Grid } from '@/lib/pixel/grid';

export interface PixelGridProps {
  grid: Grid;
  palette: Record<string, string>;
  /** Extra padding in pixel units around the sprite. */
  pad?: number;
  className?: string;
  title?: string;
  /** Applied to the <g> that holds the sprite, for CSS animations. */
  spriteClassName?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a pixel Grid as a compact SVG. Horizontal runs are merged into single
 * rects, so an 18x18 creature is typically ~60 nodes instead of 324.
 */
export function PixelGrid({
  grid,
  palette,
  pad = 0,
  className,
  title,
  spriteClassName,
  style,
}: PixelGridProps) {
  const runs = toRuns(grid);
  const w = grid.w + pad * 2;
  const h = grid.h + pad * 2;

  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g className={spriteClassName} transform={`translate(${pad} ${pad})`}>
        {runs.map((run) => (
          <rect
            key={`${run.x}-${run.y}-${run.key}`}
            x={run.x}
            y={run.y}
            width={run.len}
            height={1}
            fill={palette[run.key] ?? 'transparent'}
          />
        ))}
      </g>
    </svg>
  );
}

export default PixelGrid;
