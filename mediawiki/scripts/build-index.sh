#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
cd "$ROOT"

docker compose exec -u www-data mediawiki bash -lc "\
  php extensions/CirrusSearch/maintenance/updateSearchIndexConfig.php && \
  php extensions/CirrusSearch/maintenance/forceSearchIndex.php --skipLinks --indexOnSkip && \
  php extensions/CirrusSearch/maintenance/forceSearchIndex.php --skipParse"
