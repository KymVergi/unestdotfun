import { ImageResponse } from 'next/og';
import { buildEgg } from '@/lib/pixel/egg';
import { toRuns } from '@/lib/pixel/grid';

export const alt = 'UNEST — the fuel for a living on-chain economy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Pixel size of the hero egg on the card. 16x20 grid → 192x240. */
const UNIT = 12;
const EGG_BOTTOM = 470;
const FIELD_TOP = 500;

/**
 * The social card, drawn with the same pixel engine as the site.
 * Every "pixel" is a real div, so the card is genuinely pixel art rather than
 * a screenshot of one.
 */
export default function Image() {
  const { grid, palette } = buildEgg({ id: 1, golden: true });
  const runs = toRuns(grid);

  const eggW = grid.w * UNIT;
  const eggH = grid.h * UNIT;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: '#11130f',
        border: '12px solid #4b2d1b',
        boxSizing: 'border-box',
      }}
    >
      {/* field */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: FIELD_TOP,
          bottom: 0,
          background: '#263a24',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: FIELD_TOP,
          height: 6,
          background: '#5c8a3d',
          display: 'flex',
        }}
      />

      {/* copy */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
          paddingBottom: 90,
          width: 790,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 25,
            letterSpacing: 6,
            color: '#d98c3f',
            marginBottom: 16,
          }}
        >
          LIVE ON ETHEREUM
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: 3,
            color: '#fff1c7',
            lineHeight: 1,
          }}
        >
          UNEST
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            color: '#f4c95d',
            marginTop: 22,
            letterSpacing: 1,
          }}
        >
          THE FUEL FOR A LIVING ON-CHAIN ECONOMY.
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 21,
            color: '#b9ad8c',
            marginTop: 20,
            letterSpacing: 2,
          }}
        >
          $UNEST = TOKEN · EGG = NFT · UNISWAP V4 HOOKS
        </div>
      </div>

      {/* the egg, rendered pixel by pixel */}
      <div
        style={{
          position: 'absolute',
          right: 150,
          top: EGG_BOTTOM - eggH,
          width: eggW,
          height: eggH,
          display: 'flex',
        }}
      >
        {runs.map((run, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: run.x * UNIT,
              top: run.y * UNIT,
              width: run.len * UNIT,
              height: UNIT,
              background: palette[run.key] ?? 'transparent',
              display: 'flex',
            }}
          />
        ))}
      </div>

      {/* nest */}
      <div
        style={{
          position: 'absolute',
          right: 126,
          top: EGG_BOTTOM - 6,
          width: eggW + 48,
          height: 16,
          background: '#8b5f1c',
          display: 'flex',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 114,
          top: EGG_BOTTOM + 10,
          width: eggW + 72,
          height: 14,
          background: '#70452a',
          display: 'flex',
        }}
      />
    </div>,
    size,
  );
}
