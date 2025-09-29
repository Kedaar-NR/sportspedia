# Wikipedia Mirror (Top Pages Cache)

This repo runs a local reverse-proxy that mirrors Wikipedia while caching article HTML to disk. UI and functionality are served directly from Wikipedia; we only cache and rewrite links to keep navigation local where possible.

- Default preloader warms the top 100,000 articles by views from the Wikimedia API.
- Docker image provided for deployability.

## Quick start

```bash
cd server
npm run dev
# open http://localhost:8080
```

## Build and run

```bash
cd server
npm run build
npm start
```

## Preload top pages

Start the server first in a separate terminal, then run:

```bash
cd server
npm run preload
# Customize:
TOTAL=200000 CONCURRENCY=50 npm run preload
```

## Docker

```bash
docker build -t wikipedia-mirror -f server/Dockerfile .
docker run -p 8080:8080 wikipedia-mirror
```

## Attribution and License

This project uses content from Wikipedia and other Wikimedia projects. Content text is available under the Creative Commons Attribution-ShareAlike License (CC BY-SA 4.0) and may be available under additional terms. See:

- Wikipedia Terms of Use: https://foundation.wikimedia.org/wiki/Terms_of_Use
- CC BY-SA 4.0: https://creativecommons.org/licenses/by-sa/4.0/
- Wikimedia REST API terms: https://www.mediawiki.org/wiki/REST_API

This repository contains only a proxy and cache and is not affiliated with the Wikimedia Foundation.
