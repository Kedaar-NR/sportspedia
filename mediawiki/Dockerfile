FROM mediawiki:1.41

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
    git ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Install Vector skin (2022)
RUN mkdir -p skins && \
    if [ ! -d skins/Vector ]; then \
      git clone --depth 1 https://gerrit.wikimedia.org/r/mediawiki/skins/Vector skins/Vector; \
    fi

# Install CirrusSearch and Elastica extensions
RUN mkdir -p extensions && \
    if [ ! -d extensions/Elastica ]; then \
      git clone --depth 1 https://gerrit.wikimedia.org/r/mediawiki/extensions/Elastica extensions/Elastica; \
    fi && \
    if [ ! -d extensions/CirrusSearch ]; then \
      git clone --depth 1 https://gerrit.wikimedia.org/r/mediawiki/extensions/CirrusSearch extensions/CirrusSearch; \
    fi

# Permissions for mounted volumes
RUN chown -R www-data:www-data /var/www/html

USER www-data
