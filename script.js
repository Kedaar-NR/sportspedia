const i18nStrings = {
  readInYourLanguage: {
    en: "Read Wikipedia in your language",
    es: "Lee Wikipedia en tu idioma",
    de: "Wikipedia in deiner Sprache lesen",
    fr: "Lire Wikipédia dans votre langue",
    ru: "Читать Википедию на вашем языке",
    ja: "お好みの言語でウィキペディアを読む",
    zh: "用您的语言阅读维基百科",
    it: "Leggi Wikipedia nella tua lingua",
    pt: "Leia a Wikipédia no seu idioma",
    pl: "Czytaj Wikipedię w swoim języku",
    ar: "اقرأ ويكيبيديا بلغتك",
    nl: "Lees Wikipedia in jouw taal",
    sv: "Läs Wikipedia på ditt språk",
    uk: "Читати Вікіпедію вашою мовою"
  },
  languages: {
    en: "Languages",
    es: "Idiomas",
    de: "Sprachen",
    fr: "Langues",
    ru: "Языки",
    ja: "言語",
    zh: "语言",
    it: "Lingue",
    pt: "Idiomas",
    pl: "Języki",
    ar: "اللغات",
    nl: "Talen",
    sv: "Språk",
    uk: "Мови"
  }
};

const supportedLangs = [
  ["en","English"],["es","Español"],["de","Deutsch"],["fr","Français"],["ru","Русский"],["ja","日本語"],["zh","中文"],["it","Italiano"],["pt","Português"],["pl","Polski"],["ar","العربية"],["nl","Nederlands"],["sv","Svenska"],["uk","Українська"],["hi","हिन्दी"],["fa","فارسی"],["he","עברית"],["ko","한국어"],["vi","Tiếng Việt"],["id","Bahasa Indonesia"],["cs","Čeština"],["tr","Türkçe"],["no","Norsk"],["fi","Suomi"],["ro","Română"],["hu","Magyar"],["el","Ελληνικά"],["th","ไทย"],["da","Dansk"],["bg","Български"],["sr","Српски"],["ca","Català"],["eo","Esperanto"],["ms","Bahasa Melayu"],["sk","Slovenčina"],["sl","Slovenščina"],["et","Eesti"],["lt","Lietuvių"],["lv","Latviešu"],["eu","Euskara"],["ga","Gaeilge"]
];

function formatCount(num){
  if(num == null) return "—";
  if(num >= 1_000_000) return (num/1_000_000).toFixed(3).replace(/\.0+$/,'')+"M+ articles";
  if(num >= 1_000) return (num/1_000).toFixed(0)+"k+ articles";
  return num.toString();
}

async function fetchArticleCounts(langCodes){
  const promises = langCodes.map(async code => {
    try {
      const url = `https://${code}.wikipedia.org/w/api.php?action=query&meta=siteinfo&format=json&origin=*`;
      const res = await fetch(url);
      const json = await res.json();
      const count = json?.query?.general?.articles || json?.query?.statistics?.articles;
      return [code, count];
    } catch {
      return [code, null];
    }
  });
  const entries = await Promise.all(promises);
  return Object.fromEntries(entries);
}

function applyI18n(lang){
  const keys = Object.keys(i18nStrings);
  keys.forEach(key => {
    const els = document.querySelectorAll(`[data-i18n="${key}"]`);
    els.forEach(el => {
      const value = i18nStrings[key][lang] || i18nStrings[key].en;
      el.textContent = value;
    });
  });
}

function populateModal(counts){
  const list = document.getElementById('langList');
  list.innerHTML = '';
  supportedLangs.forEach(([code, name]) => {
    const a = document.createElement('a');
    a.className = 'lang-pill';
    a.href = `https://${code}.wikipedia.org`;
    a.target = '_blank';
    a.rel = 'noreferrer noopener';
    a.innerHTML = `<span>${name}</span><span class="sub">${formatCount(counts[code])}</span>`;
    list.appendChild(a);
  });
}

async function initCounts(){
  const cloudCodes = Array.from(document.querySelectorAll('[data-count]')).map(el => el.getAttribute('data-count'));
  const allCodes = Array.from(new Set([...cloudCodes, ...supportedLangs.map(([c])=>c)]));
  const counts = await fetchArticleCounts(allCodes);
  document.querySelectorAll('[data-count]').forEach(el => {
    const code = el.getAttribute('data-count');
    const c = counts[code];
    el.textContent = formatCount(c);
  });
  populateModal(counts);
}

function initModal(){
  const modal = document.getElementById('langModal');
  const openBtn = document.getElementById('openLang');
  const closeBtn = document.getElementById('closeLang');
  openBtn.addEventListener('click', () => modal.showModal());
  closeBtn.addEventListener('click', () => modal.close());
}

function initSearch(){
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const select = document.getElementById('langSelect');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if(!query) return;
    const lang = select.value || 'en';
    // Use opensearch API to get first result; fallback to full search page
    try {
      const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=1&search=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      const first = data?.[3]?.[0];
      if(first){
        window.location.href = first;
        return;
      }
    } catch {}
    window.location.href = `https://${lang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
  });
}

function syncFromCloudClicks(){
  document.querySelectorAll('.lang-cloud a[data-lang]').forEach(a => {
    a.addEventListener('click', (e) => {
      // allow default open in new tab if user wants
      if(!(e.metaKey || e.ctrlKey)){
        e.preventDefault();
        const code = a.getAttribute('data-lang');
        document.getElementById('langSelect').value = code;
        applyI18n(code);
      }
    });
  });
}

function init(){
  const defaultLang = 'en';
  applyI18n(defaultLang);
  initModal();
  initSearch();
  syncFromCloudClicks();
  initCounts();
}

document.addEventListener('DOMContentLoaded', init);


