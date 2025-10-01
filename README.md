# Sportspedia

A fast, sports-first reader built with Next.js. Browse leagues, jump to teams, and read hosted Wikipedia articles without leaving the site. Baseball coverage includes live MiLB rosters and MLB player pages with season and career stats, all from official public APIs.

<img width="1177" height="509" alt="image" src="https://github.com/user-attachments/assets/f648283b-a251-4fb1-97a7-144fc25826da" />


## Table of contents

* Features
* Getting started
* Useful scripts
* Project structure
* Data sources
* Images and logos
* Accuracy, tiers, and divisions
* Troubleshooting
* Deploy notes
* Committing and pushing
* License

---

## Features

**Next.js App Router**
Server components by default for speed and a clean data flow.

**Home**
Major leagues with accurate flags and logos.

**League pages**

* Tier or division selector with persistence via localStorage
* Sorting A–Z or Z–A driven by the URL
* Hosted article links that route internally to the article reader
* Logos that prefer Wikipedia PageImages, with a Wikidata crest fallback

**Article reader**

* Renders Wikipedia REST mobile-html inside the site
* Left rail breadcrumbs
* Right rail table of contents

**Baseball**

* Live MiLB team rosters from the MLB Stats API
* MLB player pages with season and career stat lines

---

## Getting started

### Prerequisites

* Node 18 or later that is compatible with Next.js 14

### Install and run

```bash
# 1) Install dependencies
npm install

# 2) Start the dev server on port 3010
npm run dev

# 3) Open the app
# http://localhost:3010
```

---

## Useful scripts

```bash
# Free ports 3000, 3001, and 3010 on macOS
npm run ports:kill

# Start Next Dev on 3010
npm run dev

# Build for production
npm run build

# Run the production server on 3010
npm run start
```

---

## Project structure

```
app/
  page.tsx                   Home
  layout.tsx                 Global layout with inlined global styles
  league/[league]/page.tsx   League page with tiers, sorting, and team list
  article/[lang]/[title]/    Hosted Wikipedia article route
  mlb/player/[id]/page.tsx   MLB player stats page
  milb/                      MiLB lists and team roster pages

components/
  Autocomplete.tsx           Site search using a Wikipedia OpenSearch proxy
  Breadcrumbs.tsx            Left rail breadcrumbs
  TierControls.tsx           Tier or division selector with persistence
  Toc.tsx                    Dynamic table of contents for the right rail

lib/
  leagues.ts                 League metadata such as names, flags, logos, tiers
  wiki.ts                    Wikipedia API helpers for PageImages and search
  wikidata.ts                SPARQL helpers for teams and P154 crest fallback
  mlb.ts                     MLB Stats API helpers
```

---

## Data sources

* **Wikipedia REST and Action API** for articles, thumbnails, and search
* **Wikidata SPARQL** for accurate current participants and crest fallback via property P154
* **MLB Stats API** for MiLB rosters and MLB player stats

---

## Images and logos

Sportspedia follows a simple rule for team imagery.

1. Try **Wikipedia PageImages** for a thumbnail associated with the team page.
2. If missing, query **Wikidata P154** for the official crest or logo.
3. Normalize Wikimedia Commons URLs to a **Special:FilePath** format with a width parameter for consistent delivery.
4. If neither is available, show the default fallback until the data exists.

---

## Accuracy, tiers, and divisions

* For the top European leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1) Sportspedia requests **current season participants** from Wikidata. A tier switcher is available for second divisions.
* For US leagues (MLB, NBA, NFL, NHL) divisions appear as tiers. Participants are pulled with the same SPARQL pattern and cached.

---

## Troubleshooting

**Icons not appearing**
Perform a hard refresh. If assets are still missing, the page likely lacks both a PageImage and a P154 crest. Consider adding a crest to Wikidata or pin a manual fallback.

**SPARQL rate limits**
The app handles empty or failed responses and falls back to category lists when needed.

**Port already in use**
Run `npm run ports:kill` to free common Next ports on macOS.

---

## Deploy notes

* No secrets are required for the public APIs used by this project.
* If you deploy behind a static CDN, make sure your setup supports Next.js server rendering or adapt routes to static where possible.

---

## Committing and pushing

```bash
# Create a commit locally
git add .
git commit -m "docs: add README and improve logos/spacing"

# Push to your origin
git push origin main
```

---

## License

This project renders and redistributes content from Wikipedia and Wikidata. These sources are licensed under **CC BY-SA** and other licenses on a per-file basis. Use all third-party content according to its original terms.
