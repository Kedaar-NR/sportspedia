import Link from "next/link";
import {
  getCategoryMembers,
  articleUrl,
  getPageThumbnails,
} from "../../../lib/wiki";
import Autocomplete from "../../../components/Autocomplete";
import Breadcrumbs from "../../../components/Breadcrumbs";
import TierControls from "../../../components/TierControls";
import { getLeagueMeta } from "../../../lib/leagues";
import {
  getLeagueTeamsByLabel,
  getLogosForTitles,
} from "../../../lib/wikidata";

type Props = {
  params: { league: string };
  searchParams?: { [k: string]: string | string[] | undefined };
};

const leagueToConfig: Record<
  string,
  { name: string; lang: string; category: string }
> = {
  "premier-league": {
    name: "Premier League",
    lang: "en",
    category: "Premier_League_clubs",
  },
  "la-liga": { name: "La Liga", lang: "en", category: "La_Liga_clubs" },
  bundesliga: { name: "Bundesliga", lang: "en", category: "Bundesliga_clubs" },
  "serie-a": { name: "Serie A", lang: "en", category: "Serie_A_clubs" },
  "ligue-1": { name: "Ligue 1", lang: "en", category: "Ligue_1_clubs" },
  mlb: {
    name: "Major League Baseball",
    lang: "en",
    category: "Major_League_Baseball_teams",
  },
  nba: {
    name: "National_Basketball_Association",
    lang: "en",
    category: "National_Basketball_Association_teams",
  },
  nfl: {
    name: "National_Football_League",
    lang: "en",
    category: "National_Football_League_teams",
  },
  nhl: {
    name: "National_Hockey_League",
    lang: "en",
    category: "National_Hockey_League_teams",
  },
};

export default async function LeaguePage({ params, searchParams }: Props) {
  const cfg = leagueToConfig[params.league];
  if (!cfg)
    return (
      <main className="container">
        <h1>League not found</h1>
      </main>
    );
  let titles = await getCategoryMembers(cfg.lang, cfg.category, 200);
  const meta = getLeagueMeta(params.league);
  const tierParam =
    typeof searchParams?.tier === "string"
      ? (searchParams!.tier as string)
      : undefined;
  const selectedTierLabel =
    meta?.tiers?.find((t) => t.key === tierParam)?.key ||
    meta?.tiers?.[0]?.key ||
    meta?.name ||
    undefined;
  const sortParam =
    typeof searchParams?.sort === "string"
      ? (searchParams!.sort as string)
      : "asc";
  if (
    meta &&
    [
      "Premier League",
      "La Liga",
      "Bundesliga",
      "Serie A",
      "Ligue 1",
      "Major League Baseball",
      "National Basketball Association",
      "National Football League",
      "National Hockey League",
    ].includes(meta.name)
  ) {
    try {
      const wdTeams = await getLeagueTeamsByLabel(
        selectedTierLabel || meta.name
      );
      if (wdTeams?.length) titles = wdTeams;
    } catch {}
  }
  const thumbs = await getPageThumbnails(cfg.lang, titles, 96);
  const logoFallbacks = await getLogosForTitles(titles);
  // filter out subcategories and non-team pages heuristically
  const collator = new Intl.Collator("en", { sensitivity: "base" });
  const teams = titles
    .filter((t) => !t.startsWith("Category:"))
    .sort((a, b) =>
      sortParam === "desc" ? collator.compare(b, a) : collator.compare(a, b)
    );
  return (
    <main
      className="container"
      style={{
        display: "grid",
        gridTemplateColumns: "230px 1fr",
        gap: 16,
        alignItems: "start",
      }}
    >
      <Breadcrumbs
        trail={[
          { href: "/", label: "Home" },
          {
            href: `/league/${params.league}`,
            label: meta ? meta.name : cfg.name,
          },
        ]}
      />
      <div>
        <h1
          className="title"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {meta && <img className="thumb" src={meta.logo} alt="" />}
          {meta
            ? `${meta.name}${meta.short ? ` (${meta.short})` : ""}`
            : cfg.name}
          {meta && (
            <span className="cardMeta">
              {meta.flag} {meta.country}
            </span>
          )}
        </h1>
        {meta?.tiers && (
          <TierControls leagueId={params.league} options={meta.tiers} />
        )}
        <Autocomplete placeholder={`Search within Wikipedia`} />
        <div className="list">
          {teams.map((title) => (
            <div key={title} className="item">
              <div className="row">
                <img
                  className="thumb"
                  src={thumbs[title] || logoFallbacks[title] || "/favicon.ico"}
                  alt={`${title} logo`}
                  loading="lazy"
                  width={34}
                  height={34}
                />
                <Link href={`/article/en/${encodeURIComponent(title)}`}>
                  {title}
                </Link>
              </div>
              <span className="cardMeta">Hosted article</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
