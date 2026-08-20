/**
 * DEMO DATA.
 * ---------------------------------------------------------------------------
 * Used only while the EGG contract is not configured. It is always labelled
 * `DEMO DATA` in the interface and is never presented as on-chain state.
 * It is generated from the same deterministic DNA the live interface uses, so
 * the demo Farm looks exactly like the real one will.
 */

import { demoCreature, type Creature } from '@/lib/protocol/creature';

export type { Creature, NestTotals } from '@/lib/protocol/creature';
export { nestTotals, eligiblePartners } from '@/lib/protocol/creature';

/** The public population used by /creatures and /gallery in demo mode. */
export const DEMO_CREATURES: Creature[] = Array.from({ length: 48 }, (_, i) => demoCreature(i + 1));

/** The wallet's own Nest used by /nest in demo mode. */
export const DEMO_NEST: Creature[] = [
  demoCreature(7),
  demoCreature(18, { generation: 1 }),
  demoCreature(23),
  demoCreature(41, { generation: 2 }),
  demoCreature(52, { sealed: true }),
];

/** A small bloodline used by the genealogy panel. */
export interface BloodlineNode {
  generation: number;
  id: number;
  parents: [number, number] | null;
  inherited: string[];
  mutation: string;
}

export const DEMO_BLOODLINE: BloodlineNode[] = [
  { generation: 0, id: 1, parents: null, inherited: [], mutation: 'NONE' },
  { generation: 0, id: 21, parents: null, inherited: [], mutation: 'NONE' },
  {
    generation: 1,
    id: 104,
    parents: [1, 21],
    inherited: ['BODY', 'EYES', 'WINGS'],
    mutation: 'SPLIT TAIL',
  },
  {
    generation: 2,
    id: 892,
    parents: [104, 37],
    inherited: ['BODY', 'HEAD', 'SPECIAL'],
    mutation: 'PRISM',
  },
];
