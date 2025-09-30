const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

async function sparql(query: string): Promise<any[]> {
    try {
        const res = await fetch(
            SPARQL_ENDPOINT + '?format=json&query=' + encodeURIComponent(query),
            {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    // Some SPARQL endpoints require an explicit UA
                    'User-Agent': 'Sportspedia/1.0 (+https://github.com/)'
                },
                next: { revalidate: 1800 },
            }
        );
        const text = await res.text();
        if (!text) return [];
        const json = JSON.parse(text);
        return json?.results?.bindings || [];
    } catch {
        // On rate limit or transient errors, fall back to empty results
        return [];
    }
}

export async function getLeagueTeamsByLabel(leagueLabelEn: string): Promise<string[]> {
    // Try to resolve current season via has part(s) or part of series relations, then fetch participating teams (P1923)
    const q = `
SELECT DISTINCT ?teamLabel WHERE {
  ?league rdfs:label "${leagueLabelEn}"@en .
  {
    ?league wdt:P527 ?season .
  } UNION {
    ?league wdt:P3450 ?season .
  }
  ?season wdt:P1923 ?team .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?teamLabel
`;
    const rows = await sparql(q);
    return rows.map(r => r.teamLabel.value);
}

export async function getLogosForTitles(titles: string[]): Promise<Record<string, string>> {
    if (!titles.length) return {};
    const chunks: string[][] = [];
    for (let i = 0; i < titles.length; i += 20) chunks.push(titles.slice(i, i + 20));
    const maps = await Promise.all(chunks.map(async (chunk) => {
        const values = chunk.map(t => `"${t.replace(/"/g, '\\"')}"`).join(' ');
        const q = `
SELECT ?title ?logo WHERE {
  ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ; schema:name ?title .
  FILTER(LANG(?title)="en")
  VALUES ?title { ${values} }
  OPTIONAL { ?item wdt:P154 ?logo }
}`;
        const rows = await sparql(q);
        const m: Record<string, string> = {};
        for (const r of rows) {
            const ti = r.title?.value as string | undefined;
            let lg = r.logo?.value as string | undefined;
            if (ti && lg) {
                // If it's a File page, request the raw file path with width param
                if (lg.includes('Special:FilePath')) {
                    if (!lg.includes('?')) lg += '?width=96';
                }
                m[ti] = lg;
            }
        }
        return m;
    }));
    return Object.assign({}, ...maps);
}


