"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const cheerio_1 = __importDefault(require("cheerio"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const CACHE_DIR = path_1.default.resolve(__dirname, '..', 'cache');
const PUBLIC_DIR = path_1.default.resolve(__dirname, '..', 'public');
const WIKI_HOST = 'https://en.wikipedia.org';
const WIKI_STATIC_HOSTS = [
    'https://upload.wikimedia.org',
    'https://meta.wikimedia.org',
    'https://commons.wikimedia.org',
    'https://www.wikimedia.org',
    'https://login.wikimedia.org'
];
async function ensureDir(dir) {
    await fs_extra_1.default.mkdirp(dir);
}
function sanitizePath(p) {
    if (p === '/' || p === '')
        return 'index.html';
    const urlPath = p.replace(/^\//, '');
    if (urlPath.startsWith('w/'))
        return urlPath;
    if (urlPath.startsWith('wiki/'))
        return `${urlPath}.html`;
    return `${urlPath}`;
}
async function readCache(cachePath) {
    const file = path_1.default.join(CACHE_DIR, cachePath);
    try {
        return await fs_extra_1.default.readFile(file);
    }
    catch {
        return null;
    }
}
async function writeCache(cachePath, data) {
    const file = path_1.default.join(CACHE_DIR, cachePath);
    await ensureDir(path_1.default.dirname(file));
    await fs_extra_1.default.writeFile(file, data);
}
function rewriteHtml(html) {
    const $ = cheerio_1.default.load(html);
    $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href)
            return;
        if (href.startsWith('/wiki/')) {
            $(el).attr('href', href);
        }
        else if (href.startsWith('//')) {
            $(el).attr('href', `https:${href}`);
        }
    });
    $('link[href], script[src], img[src]').each((_, el) => {
        const attrib = $(el).attr('href') ? 'href' : 'src';
        const val = $(el).attr(attrib);
        if (!val)
            return;
        if (val.startsWith('//'))
            $(el).attr(attrib, `https:${val}`);
    });
    return $.html();
}
app.use((0, morgan_1.default)('tiny'));
app.use('/static', express_1.default.static(PUBLIC_DIR, { maxAge: '365d', immutable: true }));
app.get(['/', '/wiki/*', '/w/*'], async (req, res, next) => {
    const cacheKey = sanitizePath(req.path);
    const cached = await readCache(cacheKey);
    if (cached) {
        const isHtml = cacheKey.endsWith('.html') || cacheKey === 'index.html';
        if (isHtml)
            res.setHeader('content-type', 'text/html; charset=utf-8');
        return res.status(200).send(cached);
    }
    next();
});
const setUA = (proxyReq) => {
    proxyReq.setHeader('User-Agent', 'Wikipedia-Mirror/1.0');
};
app.use('/w', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: WIKI_HOST,
    changeOrigin: true,
    on: { proxyReq: setUA }
}));
app.use('/wiki', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: WIKI_HOST,
    changeOrigin: true,
    selfHandleResponse: true,
    on: { proxyReq: setUA },
    onProxyRes: (0, http_proxy_middleware_1.responseInterceptor)(async (responseBuffer, proxyRes, req, res) => {
        const contentType = (proxyRes.headers['content-type'] || '');
        const isHtml = contentType.includes('text/html');
        if (isHtml) {
            const rewritten = rewriteHtml(responseBuffer.toString('utf-8'));
            const buf = Buffer.from(rewritten, 'utf-8');
            const cacheKey = sanitizePath(req.url || '');
            await writeCache(cacheKey, buf);
            res.setHeader('content-type', 'text/html; charset=utf-8');
            return buf;
        }
        return responseBuffer;
    })
}));
for (const host of WIKI_STATIC_HOSTS) {
    app.use('/', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: host,
        changeOrigin: true
    }));
}
app.use('/', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: WIKI_HOST,
    changeOrigin: true,
    selfHandleResponse: true,
    on: { proxyReq: setUA },
    onProxyRes: (0, http_proxy_middleware_1.responseInterceptor)(async (responseBuffer, proxyRes, req, res) => {
        const contentType = (proxyRes.headers['content-type'] || '');
        const isHtml = contentType.includes('text/html');
        if (isHtml) {
            const rewritten = rewriteHtml(responseBuffer.toString('utf-8'));
            const buf = Buffer.from(rewritten, 'utf-8');
            const cacheKey = sanitizePath(req.url || '/');
            res.setHeader('content-type', 'text/html; charset=utf-8');
            await writeCache(cacheKey, buf);
            return buf;
        }
        return responseBuffer;
    })
}));
app.listen(PORT, async () => {
    await ensureDir(CACHE_DIR);
    console.log(`Wikipedia mirror running on http://localhost:${PORT}`);
});
