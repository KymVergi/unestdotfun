# UNEST — Pixel Farm

A production-quality Web3 site for **UNEST**, an on-chain creature economy on **Ethereum mainnet**.

```
$UNEST  =  TOKEN     (ERC-20, the fuel)
EGG     =  NFT       (ERC-721, the creature)
NEST    =  ECONOMY
FARM    =  WORLD
HOOKS   =  ENGINE    (Uniswap v4)
```

**FEED THE NEST.**

---

## Going live is one file

There is no code change between "contracts not deployed" and "contracts live". Fill in
`.env.local` and every module switches itself on.

```bash
cp .env.example .env.local   # then paste the real addresses
```

| Left empty                             | What happens                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_EGG_NFT_ADDRESS`          | `/nest`, `/creatures` and `/gallery` serve `DEMO DATA`, clearly labelled              |
| `NEXT_PUBLIC_UNEST_TOKEN_ADDRESS`      | balance reads and the approve step are disabled                                       |
| any engine address                     | that action's button is disabled and reads `CONTRACT NOT CONFIGURED`                  |
| `NEXT_PUBLIC_SUBGRAPH_URL`             | the population is enumerated on-chain instead, bounded by `ONCHAIN_ENUMERATION_LIMIT` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | only injected wallets are offered — the connector is not registered at all            |
| `NEXT_PUBLIC_RPC_URL`                  | viem's public endpoint is used, which will rate-limit under real traffic              |

Addresses are validated against `/^0x[a-f0-9]{40}$/i` (and `{64}` for the pool id) **before** they
are used, so a typo degrades to demo mode instead of producing a bad transaction.
**No address is invented anywhere in this codebase.**

Point the EGG contract's `tokenURI` at `https://<your-domain>/api/egg/` and the collection renders
on marketplaces immediately — see [NFT metadata](#nft-metadata).

## Stack

|           |                                                               |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack)                            |
| Language  | TypeScript, strict                                            |
| Styling   | **CSS Modules only — no Tailwind, no utility classes**        |
| Web3      | wagmi v3 + viem — injected, Coinbase, optional WalletConnect  |
| Motion    | CSS animations first, Framer Motion where it earns its weight |
| Icons     | in-house 12×12 pixel set, zero icon dependencies              |
| Art       | 100% procedural pixel SVG. No bitmaps, no stock images        |
| Tests     | Vitest — 51 tests over the economic and pixel logic           |

Server Components by default; only the components that genuinely need the browser are
`"use client"` — wallet state, interactive state, or Framer Motion.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run check        # typecheck + lint + tests
```

| Script              |                                                         |
| ------------------- | ------------------------------------------------------- |
| `npm run typecheck` | `tsc --noEmit`                                          |
| `npm run lint`      | ESLint flat config (`next lint` was removed in Next 16) |
| `npm run test`      | Vitest                                                  |
| `npm run format`    | Prettier                                                |

## Routes

| Route                                                  | What it is                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `/`                                                    | Hero farm, the loop, asset registry, reward split, flywheel, token sinks, scarcity |
| `/protocol`                                            | Buy → egg → hatch → feed → grow, plus breeding, bloodline, evolution, backing      |
| `/nest`                                                | The dashboard. Live balances, creature cards, real on-chain actions                |
| `/creatures`                                           | Population explorer with rarity filters                                            |
| `/gallery`                                             | Trait gallery with sorting and trait filters                                       |
| `/hooks`                                               | The engine: six Uniswap v4 hook modules + architecture diagram                     |
| `/contracts`                                           | Contract registry with copy and explorer links                                     |
| `/docs`                                                | 16-section terminal documentation and FAQ                                          |
| `/legal`                                               | Terms, risks and official channels                                                 |
| `/api/egg/[id]`                                        | ERC-721 metadata JSON                                                              |
| `/api/egg/[id]/image`                                  | The token image, as pixel SVG                                                      |
| `/opengraph-image`                                     | Social card, generated as real pixel art                                           |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generated from config                                                              |

## Where data comes from

Resolved once, from configuration alone — components never know which source they got.

```
useNest()        wallet's own EGGs
                 balanceOf → tokenOfOwnerByIndex → creatureOf, batched via multicall
                 no indexer needed: enumeration is per-owner

usePopulation()  the whole collection
                 subgraph if NEXT_PUBLIC_SUBGRAPH_URL is set
                 else bounded on-chain enumeration
                 else DEMO DATA
```

Energy decays with wall-clock time, so the UI applies the same decay the contract would apply on
its next interaction (`currentEnergy(stored, lastFedAt, now)`), driven by a `useSyncExternalStore`
clock that ticks once a minute. Displayed energy is never stale.

### Subgraph contract

If you point `NEXT_PUBLIC_SUBGRAPH_URL` at an indexer, it must answer:

```graphql
query Population($first: Int!) {
  eggs(first: $first, orderBy: tokenId, orderDirection: asc) {
    tokenId
    sealed
    rarity
    energy
    rewardWeight
    generation
    breedCount
    evolutionCount
    lastFedAt
    breedReadyAt
  }
}
```

## Transactions

Every action goes through one component, `TxButton`, which runs the full real lifecycle:

```
allowance check → approve (exact amount) → simulate → write → wait for receipt
```

- `useSimulateContract` runs first, so a call that would revert never reaches your wallet — the
  button says `WOULD REVERT` instead.
- Balance is checked before the approve step: `NOT ENOUGH $UNEST` rather than a failed transaction.
- The approve step requests the **exact** amount, not an unlimited allowance.
- States are the real ones: `CONFIRM IN WALLET` → `PENDING` → `CONFIRMED` / `FAILED`.

**Nothing is ever faked.** No simulated transaction, no fabricated hash, no confirmation that did
not happen on-chain. Transaction hashes shown come back from the wallet and link to Etherscan.

## NFT metadata

`/api/egg/[id]` serves ERC-721 metadata. When the EGG contract is configured it reads the token's
real state from the chain; if the contract is missing or the RPC is unreachable it serves clearly
flagged preview metadata (`unest.onChain: false`) rather than guessing.

`/api/egg/[id]/image` renders the token as pixel SVG. The art is a pure function of the id — no
image files, no CDN, no pinning — so the same creature appears in the gallery, in the dashboard and
on OpenSea.

## Pixel art system

Everything visual is generated from a small grid engine.

```
src/lib/pixel/grid.ts       Grid primitives: rect, mirror, outline, run-length export
src/lib/pixel/egg.ts        Procedural shell — shading, speckles, cracks, hatch opening
src/lib/pixel/creature.ts   18×18 creature — body, eyes, mouth, head, wings, accessory
src/lib/pixel/dna.ts        Deterministic DNA: an id always yields the same creature
src/lib/pixel/svg.ts        Server-side rendering for metadata and social cards
```

`PixelGrid` collapses horizontal runs into single `<rect>` nodes, so an 18×18 creature ships as
roughly 60 SVG nodes instead of 324. Sprites are symmetric by construction and outlined
automatically, which is what keeps every asset visibly part of the same universe.

## Configuration

Two files hold everything; nothing is hardcoded in components.

**`src/config/protocol.ts`** — every economic constant:

```
UNEST_SUPPLY 100,000,000,000 · UNEST_DECIMALS 18
MINT_UNIT 50,000,000 · THEORETICAL_MAX_EGGS 2,000
HATCH_COST 2,500,000
MAX_ENERGY 100 · ENERGY_DECAY 10 / ~24h · FEED_COST 500,000 · FEED_AMOUNT +50
BREED_COST 5,000,000 · BREED_COOLDOWN 3 days
EVOLUTION_COST 10,000,000 · EVOLUTION_MIN_ENERGY 75 · 70% / 30%
REWARD_DISTRIBUTION 90 / 5 / 3 / 2
REWARD_WEIGHT_BASE 100 · REWARD_WEIGHT_CAP 400
```

**`src/config/contracts.ts`** — addresses, network and the resolved data source.
**`src/config/site.ts`** — canonical URL, social links, metadata base.

## Design tokens

Defined once in `src/styles/globals.css`, never repeated as raw hex in components.

```
--color-eggshell   #fff1c7      --color-dark-green  #263a24
--color-yolk       #f4c95d      --color-bg          #11130f
--color-wood       #70452a      --color-accent      #d98c3f
--color-barn       #a94a38      --px                4px   (the pixel unit of the whole UI)
--color-farm-green #5c8a3d
```

Type: **Press Start 2P** for headings and UI chrome, **VT323** for body copy, both via `next/font`.
Pixel fonts are never used for long paragraphs.

> `next/font` downloads the fonts at build time. A machine with no access to
> `fonts.googleapis.com` will fail the build — self-host with `next/font/local` if you need fully
> offline builds.

## Motion & accessibility

- CRT scanlines, grain and vignette are fixed overlays with `pointer-events: none`.
- Every animated component honours `prefers-reduced-motion: reduce`, in CSS and in JS.
- Hydration-sensitive UI uses `useSyncExternalStore`, not `setState` in an effect.
- Meters, groups, dialogs and toggles carry real ARIA; there is a skip link to `#main`.

## Responsive

- **Desktop** — full farm scene with clouds, birds, stars, crops and parallax layers.
- **Tablet** — reduced decorative layers, stacked hero.
- **Mobile** — simplified background, pixel drawer navigation, single-column dashboard, and the
  flywheel becomes a readable top-to-bottom list. The wallet button is always reachable.

## Deploying

1. Push the repo and import it (Vercel, or anything that runs Next 16).
2. Add every `NEXT_PUBLIC_*` variable from `.env.example` to the host's environment.
3. Set `NEXT_PUBLIC_SITE_URL` to the real domain — canonical URLs, the sitemap, the social card and
   the NFT metadata base all derive from it.
4. Point the EGG contract's `tokenURI` at `https://<domain>/api/egg/`.
5. Re-deploy after filling addresses: `NEXT_PUBLIC_*` values are inlined at build time.

## What this project does not claim

Not audited. Not risk free. No guaranteed yield. No guaranteed rewards. No APR is displayed
anywhere, because none can be honestly promised — distribution depends entirely on pool activity.
Verify every contract yourself before interacting with anything. See `/legal`.
