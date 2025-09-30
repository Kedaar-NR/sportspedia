import Breadcrumbs from "../../../../components/Breadcrumbs";
import Toc from "../../../../components/Toc";

async function fetchArticleHTML(lang: string, title: string) {
  const encoded = encodeURIComponent(title.replace(/\s/g, "_"));
  const res = await fetch(
    `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-html/${encoded}`,
    { cache: "no-store" }
  );
  const html = await res.text();
  return html;
}

export default async function ArticlePage({
  params,
}: {
  params: { lang: string; title: string };
}) {
  const { lang, title } = params;
  const html = await fetchArticleHTML(lang, decodeURIComponent(title));
  return (
    <main
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "230px 1fr 260px",
        gap: 16,
        alignItems: "start",
      }}
    >
      <Breadcrumbs trail={[{ href: "/", label: "Home" }]} />
      <article
        style={{
          background: "#fff",
          border: "1px solid #eaecf0",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <Toc />
    </main>
  );
}
