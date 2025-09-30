export async function wikiFetch(lang: string, params: Record<string, string>): Promise<any> {
    const usp = new URLSearchParams({ format: 'json', origin: '*', ...params });
    const url = `https://${lang}.wikipedia.org/w/api.php?` + usp.toString();
    const res = await fetch(url, { next: { revalidate: 3600 } });
    return res.json();
}

export async function getCategoryMembers(lang: string, category: string, limit = 200): Promise<string[]> {
    // returns page titles in a category
    const json = await wikiFetch(lang, {
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${category}`,
        cmlimit: String(limit),
        cmtype: 'page|subcat',
    });
    const items = json?.query?.categorymembers || [];
    return items.map((i: any) => i.title);
}

export function articleUrl(lang: string, title: string): string {
    return `https://${lang}.wikipedia.org/wiki/` + encodeURIComponent(title.replace(/\s/g, '_'));
}

export async function searchPlayers(lang: string, teamName: string, limit = 20) {
    const json = await wikiFetch(lang, {
        action: 'query',
        list: 'search',
        srsearch: `${teamName} player`,
        srlimit: String(limit),
    });
    return (json?.query?.search || []).map((s: any) => s.title);
}

export async function getPageThumbnails(lang: string, titles: string[], size = 64): Promise<Record<string, string | undefined>> {
    if (titles.length === 0) return {};
    const chunks: string[][] = [];
    for (let i = 0; i < titles.length; i += 48) chunks.push(titles.slice(i, i + 48));
    const entries: [string, string | undefined][][] = await Promise.all(chunks.map(async (chunk) => {
        const json = await wikiFetch(lang, {
            action: 'query',
            prop: 'pageimages',
            titles: chunk.join('|'),
            pithumbsize: String(size),
            redirects: '1',
        });
        const pages = json?.query?.pages || {};
        return Object.values(pages).map((p: any) => [p.title as string, p.thumbnail?.source as (string | undefined)]);
    }));
    return Object.fromEntries(entries.flat());
}


