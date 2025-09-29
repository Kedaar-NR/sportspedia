# Full Local Wikipedia (MediaWiki) Stack

This directory contains a Dockerized MediaWiki deployment with MariaDB and Elasticsearch, configured with the Vector skin and CirrusSearch search extension. This runs a standalone wiki on your machine that looks like Wikipedia. To actually host Wikipedia content locally, you must import dumps.

## Bring up the stack
```bash
cd mediawiki
cp LocalSettings.template.php LocalSettings.php
# Edit LocalSettings.php if needed
docker compose up --build -d
# Open http://localhost:8081
```

## Import Wikipedia page dumps (English, articles only)
Imports are large and may take many hours and significant disk space.
```bash
# 1) Get dumps (example: latest pages-articles)
mkdir -p dumps && cd dumps
curl -O https://dumps.wikimedia.org/enwiki/latest/enwiki-latest-pages-articles.xml.bz2

# 2) Inside the container, run import
cd ..
docker compose exec -u www-data mediawiki bash -lc "\
  php maintenance/importDump.php --conf /var/www/html/LocalSettings.php /var/www/html/dumps/enwiki-latest-pages-articles.xml.bz2 && \
  php maintenance/runJobs.php --maxjobs 1000"

# 3) Build CirrusSearch index
docker compose exec -u www-data mediawiki bash -lc "\
  php extensions/CirrusSearch/maintenance/updateSearchIndexConfig.php && \
  php extensions/CirrusSearch/maintenance/forceSearchIndex.php --skipLinks --indexOnSkip && \
  php extensions/CirrusSearch/maintenance/forceSearchIndex.php --skipParse"
```

## Notes
- Images/media are not included by the text dump. Downloading media requires many terabytes and separate tooling.
- This stack is for development/testing. For production you would add backup, caching, jobrunner workers, and tune PHP/Elasticsearch.
