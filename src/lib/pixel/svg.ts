/**
 * Server-side SVG rendering for the pixel art.
 * Used by the NFT metadata API and the social card, so a marketplace and a
 * timeline preview show exactly the same creature the site shows.
 */

import { toRuns, type Grid } from './grid';
import { buildCreature } from './creature';
import { buildEgg } from './egg';
import { creatureDNA, eggDNA } from './dna';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Renders a grid's runs as `<rect>` elements, offset by (ox, oy). */
export function gridToRects(grid: Grid, palette: Record<string, string>, ox = 0, oy = 0): string {
  return toRuns(grid)
    .map(
      (run) =>
        `<rect x="${run.x + ox}" y="${run.y + oy}" width="${run.len}" height="1" fill="${
          palette[run.key] ?? 'transparent'
        }"/>`,
    )
    .join('');
}

/** Background palettes keyed by the BACKGROUND trait. */
const BACKGROUNDS: Record<string, { sky: string; ground: string; accent: string }> = {
  'DAWN FIELD': { sky: '#6d4a55', ground: '#3f5f2c', accent: '#d98c3f' },
  'HAY LOFT': { sky: '#70452a', ground: '#8b5f1c', accent: '#f4c95d' },
  'MOONLIT COOP': { sky: '#1b2340', ground: '#263a24', accent: '#9fb6c4' },
  'STORM FENCE': { sky: '#2f3a4e', ground: '#35552a', accent: '#cfe0e9' },
  'GOLDEN HARVEST': { sky: '#a3603f', ground: '#5c8a3d', accent: '#f4c95d' },
};

const CANVAS = 32;

function backgroundFor(name: string) {
  return BACKGROUNDS[name] ?? BACKGROUNDS['DAWN FIELD'];
}

function frame(inner: string, title: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" `,
    `width="640" height="640" shape-rendering="crispEdges" `,
    `style="image-rendering:pixelated">`,
    `<title>${escapeXml(title)}</title>`,
    inner,
    `</svg>`,
  ].join('');
}

/** A hatched creature on its trait background. */
export function renderCreatureSvg(id: number): string {
  const dna = creatureDNA(id);
  const { grid, palette } = buildCreature(id, dna);
  const bg = backgroundFor(dna.traits.BACKGROUND);

  const horizon = 22;
  const parts = [
    `<rect width="${CANVAS}" height="${CANVAS}" fill="${bg.sky}"/>`,
    `<rect y="${horizon}" width="${CANVAS}" height="${CANVAS - horizon}" fill="${bg.ground}"/>`,
    `<rect y="${horizon}" width="${CANVAS}" height="1" fill="${bg.accent}" opacity="0.6"/>`,
    `<rect x="3" y="3" width="2" height="2" fill="${bg.accent}" opacity="0.7"/>`,
    `<rect x="26" y="5" width="3" height="1" fill="${bg.accent}" opacity="0.45"/>`,
    // creature, 18x18 centred a little above the horizon
    gridToRects(grid, palette, 7, 5),
    // ground shadow
    `<rect x="12" y="${horizon}" width="8" height="1" fill="#11130f" opacity="0.35"/>`,
    // pixel border
    `<rect width="${CANVAS}" height="1" fill="#11130f"/>`,
    `<rect y="${CANVAS - 1}" width="${CANVAS}" height="1" fill="#11130f"/>`,
    `<rect width="1" height="${CANVAS}" fill="#11130f"/>`,
    `<rect x="${CANVAS - 1}" width="1" height="${CANVAS}" fill="#11130f"/>`,
  ];

  return frame(parts.join(''), `UNEST creature #${id}`);
}

/** A Sealed EGG — no traits revealed. */
export function renderSealedEggSvg(id: number): string {
  const { grid, palette } = buildEgg({ id });
  const shell = eggDNA(id);

  const parts = [
    `<rect width="${CANVAS}" height="${CANVAS}" fill="#11130f"/>`,
    `<rect y="22" width="${CANVAS}" height="10" fill="#263a24"/>`,
    `<rect y="22" width="${CANVAS}" height="1" fill="${shell.shell}" opacity="0.4"/>`,
    // nest
    `<rect x="9" y="24" width="14" height="2" fill="#8b5f1c"/>`,
    `<rect x="8" y="26" width="16" height="2" fill="#70452a"/>`,
    // egg, 16x20
    gridToRects(grid, palette, 8, 4),
    `<rect width="${CANVAS}" height="1" fill="#11130f"/>`,
    `<rect y="${CANVAS - 1}" width="${CANVAS}" height="1" fill="#11130f"/>`,
    `<rect width="1" height="${CANVAS}" fill="#11130f"/>`,
    `<rect x="${CANVAS - 1}" width="1" height="${CANVAS}" fill="#11130f"/>`,
  ];

  return frame(parts.join(''), `UNEST sealed EGG #${id}`);
}

export function renderEggOrCreature(id: number, isSealed: boolean): string {
  return isSealed ? renderSealedEggSvg(id) : renderCreatureSvg(id);
}
