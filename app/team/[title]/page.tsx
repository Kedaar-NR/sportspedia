import Link from "next/link";
import {
  articleUrl,
  searchPlayers,
  getPageThumbnails,
} from "../../../lib/wiki";

type Props = { params: { title: string } };

export default async function TeamPage({ params }: Props) {
  const decoded = decodeURIComponent(params.title);
  const lang = "en";
  const players = await searchPlayers(lang, decoded, 30);
  const thumbs = await getPageThumbnails(lang, [decoded, ...players], 64);
  return (
    <main className="container">
      <h1 className="title">{decoded}</h1>
      <div className="searchRow">
        <a
          className="searchBtn"
          href={articleUrl(lang, decoded)}
          target="_blank"
          rel="noreferrer noopener"
        >
          Team on Wikipedia ↗
        </a>
        <Link className="searchBtn" href="/">
          All leagues
        </Link>
      </div>
      <h2 className="subtitle">Players</h2>
      <div className="list">
        {players.map((p) => (
          <div key={p} className="item">
            <div className="row">
              <img className="thumb" src={thumbs[p] || "/favicon.ico"} alt="" />
              <span>{p}</span>
            </div>
            <a
              href={articleUrl(lang, p)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Wikipedia ↗
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
