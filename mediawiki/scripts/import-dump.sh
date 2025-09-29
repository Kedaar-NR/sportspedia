#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
cd "$ROOT"

if [ ! -f dumps/enwiki-latest-pages-articles.xml.bz2 ]; then
  echo "Dump not found at dumps/enwiki-latest-pages-articles.xml.bz2"
  echo "Download with: curl -O https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles.xml.bz2 -o dumps/enwiki-latest-pages-articles.xml.bz2"
  exit 1
fi

docker compose exec -u www-data mediawiki bash -lc "php maintenance/importDump.php --conf /var/www/html/LocalSettings.php /var/www/html/dumps/enwiki-latest-pages-articles.xml.bz2 && php maintenance/runJobs.php --maxjobs 1000"
