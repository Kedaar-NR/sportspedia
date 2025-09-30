import Link from "next/link";
import { getMiLBTeams, teamLogo } from "../../lib/mlb";

export const revalidate = 300; // 5 minutes

export default async function MiLBPage() {
  const teams = await getMiLBTeams();
  // group by parent org if available
  const sorted = teams.sort((a, b) =>
    (a.parentOrgName || a.name).localeCompare(b.parentOrgName || b.name)
  );
  return (
    <main className="container">
      <h1 className="title">Minor League Baseball</h1>
      <div className="list">
        {sorted.map((t) => (
          <div key={t.id} className="item">
            <div className="row">
              <img className="thumb" src={teamLogo(t.id)} alt="" />
              <div>
                <Link href={`/milb/team/${t.id}`}>{t.name}</Link>
                <div className="cardMeta">
                  {t.parentOrgName || t.locationName}
                </div>
              </div>
            </div>
            <div className="cardMeta">{t.league?.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
