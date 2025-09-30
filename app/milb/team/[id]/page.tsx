import Link from "next/link";
import {
  getTeamRoster,
  mlbHeadshot,
  getTeamCoaches,
} from "../../../../lib/mlb";

type Props = { params: { id: string } };

export const revalidate = 300; // refresh every 5 minutes

export default async function MilbTeamPage({ params }: Props) {
  const teamId = Number(params.id);
  const [roster, staff] = await Promise.all([
    getTeamRoster(teamId),
    getTeamCoaches(teamId),
  ]);
  const manager = staff.find((s) => /manager/i.test(s.job));
  return (
    <main className="container">
      <h1 className="title">Team #{teamId} Roster</h1>
      <div className="btnRow">
        <Link className="searchBtn" href="/milb">
          ← All MiLB Teams
        </Link>
        <Link className="searchBtn" href={`/league/minor`}>
          Minor league roster
        </Link>
      </div>
      {manager && (
        <div className="item manager" style={{ marginTop: 12 }}>
          <div className="row">
            <img
              className="thumb"
              src={mlbHeadshot(manager.person.id)}
              alt=""
            />
            <div>
              <div className="cardTitle">{manager.person.fullName}</div>
              <div className="cardMeta">{manager.job}</div>
            </div>
          </div>
          <span className="cardMeta">Manager</span>
        </div>
      )}
      <div className="list" style={{ marginTop: 12 }}>
        {roster.map((r) => (
          <div key={r.person.id} className="item">
            <div className="row">
              <img className="thumb" src={mlbHeadshot(r.person.id)} alt="" />
              <div>
                <div className="cardTitle">
                  <Link href={`/mlb/player/${r.person.id}`}>
                    {r.person.fullName}
                  </Link>
                </div>
                <div className="cardMeta">
                  {r.position?.name || ""} • #{r.jerseyNumber || "—"}
                </div>
              </div>
            </div>
            <span className="cardMeta">ID {r.person.id}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
