"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const LOCAL_HOST = process.env.LOCAL_HOST || 'http://localhost:8080';
const TOTAL = Number(process.env.TOTAL || 100000);
async function getTopPages(limit) {
    // Wikimedia REST API: Top viewed per day. We'll iterate recent days until we reach the limit
    const titles = new Set();
    const today = new Date();
    for (let i = 0; i < 120 && titles.size < limit; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i - 1);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const url = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${yyyy}/${mm}/${dd}`;
        try {
            const res = await (0, node_fetch_1.default)(url);
            if (!res.ok)
                continue;
            const data = await res.json();
            const articles = data?.items?.[0]?.articles;
            if (!articles)
                continue;
            for (const a of articles) {
                if (a.article && !a.article.startsWith('Special:') && a.article !== 'Main_Page') {
                    titles.add(a.article);
                    if (titles.size >= limit)
                        break;
                }
            }
        }
        catch {
            // ignore transient errors
        }
    }
    return Array.from(titles).slice(0, limit);
}
async function warm(title) {
    const url = `${LOCAL_HOST}/wiki/${encodeURIComponent(title)}`;
    try {
        const res = await (0, node_fetch_1.default)(url);
        if (!res.ok)
            console.log(`ERR ${res.status} ${title}`);
    }
    catch (e) {
        console.log(`ERR ${title} ${e.message}`);
    }
}
async function main() {
    const titles = await getTopPages(TOTAL);
    console.log(`Warming ${titles.length} pages...`);
    const concurrency = Number(process.env.CONCURRENCY || 25);
    let index = 0;
    async function worker() {
        while (index < titles.length) {
            const current = index++;
            await warm(titles[current]);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    console.log('Done.');
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
