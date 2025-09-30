Sportspedia

Overview

Sportspedia is a Next.js application that provides a fast, sports‑focused reader experience with hosted Wikipedia articles, league → team navigation, logos, and live rosters/stats for baseball via official APIs.

Key features

- Next.js App Router (server components by default)
- Home with major leagues and accurate flags/logos
- League pages
  - Tier/division selector with persistence (localStorage)
  - Sorting A–Z / Z–A (URL driven)
  - Hosted article links (no redirect) to internal article route
  - Logos: Wikipedia PageImages first, then Wikidata P154 crest fallback
- Article reader
  - Renders Wikipedia REST mobile‑html inside the site
  - Left breadcrumbs and right table of contents
- Baseball (MLB/MiLB)
  - Live MiLB team rosters via MLB Stats API
  - Player pages with season/career stat lines

Getting started

Prerequisites

- Node 18+ (or the version supported by Next.js 14)

Install and run

1) Install dependencies

   npm install

2) Start the dev server (uses port 3010)

   npm run dev

3) Open the app

   http://localhost:3010

Useful scripts

- npm run ports:kill  — frees ports 3000/3001/3010 on macOS
- npm run dev        — start Next Dev on 3010
- npm run build      — build production
- npm run start      — run production server on 3010

Project structure (important bits)

- app/
  - page.tsx                  — home
  - layout.tsx                — global layout + inlined global styles
  - league/[league]/page.tsx  — league page (tiers, sorting, team list)
  - article/[lang]/[title]/   — hosted Wikipedia article
  - mlb/player/[id]/page.tsx  — MLB player stats page
  - milb/                     — MiLB list and team roster pages
- components/
  - Autocomplete.tsx          — site search (Wikipedia OpenSearch proxy)
  - Breadcrumbs.tsx           — left rail breadcrumbs
  - TierControls.tsx          — tier/division selector with persistence
  - Toc.tsx                   — dynamic table of contents (right rail)
- lib/
  - leagues.ts                — league metadata (names, flags, logos, tiers)
  - wiki.ts                   — Wikipedia API helpers (PageImages, search)
  - wikidata.ts               — SPARQL helpers (teams, P154 crest fallback)
  - mlb.ts                    — MLB Stats API helpers

Data sources

- Wikipedia REST/Action API — articles, thumbnails, search
- Wikidata SPARQL — accurate current participants and crest fallback (P154)
- MLB Stats API — rosters and player stats

Notes on images/logos

- The app prefers PageImages (thumbnail) for a team name.
- If unavailable, it queries Wikidata for property P154 (logo) and normalizes Commons URLs to a fetchable Special:FilePath with a width parameter.
- Some teams may have neither asset; those will show the default fallback until data exists.

Accuracy and tiers/divisions

- For the top European leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1), the app requests current season participants from Wikidata. A tier switcher is provided for second divisions.
- For US leagues (MLB/NBA/NFL/NHL) the app exposes divisions as tiers. Participants are pulled via the same SPARQL pattern and cached.

Troubleshooting

- Icons not appearing: hard refresh. If still missing, the page likely lacks both PageImage and P154 crest. Add a crest to Wikidata, or pin a manual fallback.
- SPARQL rate limits: the app handles empty/failed responses gracefully and falls back to category lists when needed.
- Port in use: run npm run ports:kill.

Deploy notes

- The app does not require secrets for the public APIs used here.
- If deploying behind a static CDN, ensure Next.js server rendering is supported (or adapt to static where possible).

Committing and pushing

1) Create a commit locally

   git add .
   git commit -m "docs: add README and improve logos/spacing"

2) Push to your origin (replace with your remote)

   git push origin main

License

This project contains content from Wikipedia/Wikidata which is licensed under CC BY‑SA and other licenses per file level. Use according to their terms.


