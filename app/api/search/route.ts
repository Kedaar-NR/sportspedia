import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const lang = searchParams.get('lang') || 'en';
    if (!q.trim()) return new Response(JSON.stringify([]), { headers: { 'content-type': 'application/json' } });
    const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=10&search=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    const titles: string[] = data?.[1] || [];
    const links: string[] = data?.[3] || [];
    const items = titles.map((t, i) => ({ title: t, url: links[i] }));
    return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json' } });
}


