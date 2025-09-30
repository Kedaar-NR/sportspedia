import Link from "next/link";
import Autocomplete from "../components/Autocomplete";
import { leaguesMeta } from "../lib/leagues";

const leagues: { id: string; name: string; country?: string }[] = [
  { id: "premier-league", name: "Premier League", country: "England" },
  { id: "la-liga", name: "La Liga", country: "Spain" },
  { id: "bundesliga", name: "Bundesliga", country: "Germany" },
  { id: "serie-a", name: "Serie A", country: "Italy" },
  { id: "ligue-1", name: "Ligue 1", country: "France" },
  { id: "mlb", name: "MLB", country: "USA" },
  { id: "nba", name: "NBA", country: "USA" },
  { id: "nfl", name: "NFL", country: "USA" },
  { id: "nhl", name: "NHL", country: "USA/Canada" },
];

export default function Home() {
  return (
    <main className="container">
      <h1 className="title">Sportspedia</h1>
      <p className="subtitle">
        Explore teams and players with links to their Wikipedia pages.
      </p>
      <Autocomplete placeholder="Search teams or players on Wikipedia" />
      <div className="grid">
        {leaguesMeta.map((l) => (
          <Link key={l.id} className="card" href={`/league/${l.id}`}>
            <div className="row">
              <img className="thumb" src={l.logo} alt="" />
              <div>
                <div className="cardTitle">
                  {l.name}
                  {l.short ? ` (${l.short})` : ""}
                </div>
                <div className="cardMeta">
                  {l.flag} {l.country}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
