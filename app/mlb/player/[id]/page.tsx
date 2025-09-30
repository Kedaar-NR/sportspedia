import { getPlayerBio, getPlayerStats, mlbHeadshot } from "../../../../lib/mlb";

type Props = { params: { id: string } };

export const revalidate = 300;

function extractStatLine(stats: any[], type: "season" | "career") {
  const s = stats.find((x: any) => x.type?.displayName?.toLowerCase() === type);
  const g = s?.splits?.[0]?.stat || {};
  return g;
}

export default async function PlayerPage({ params }: Props) {
  const id = Number(params.id);
  const [bio, stats] = await Promise.all([
    getPlayerBio(id),
    getPlayerStats(id),
  ]);
  const hittingSeason = extractStatLine(stats.hitting || [], "season");
  const hittingCareer = extractStatLine(stats.hitting || [], "career");
  const pitchingSeason = extractStatLine(stats.pitching || [], "season");
  const pitchingCareer = extractStatLine(stats.pitching || [], "career");
  return (
    <main className="container">
      <div className="btnRow">
        <a className="searchBtn" href="/milb">
          ← All MiLB Teams
        </a>
      </div>
      <div className="item" style={{ alignSelf: "stretch" }}>
        <div className="row">
          <img className="thumb" src={mlbHeadshot(id, 120)} alt="" />
          <div>
            <div className="cardTitle" style={{ fontSize: 22 }}>
              {bio?.fullName}
            </div>
            <div className="cardMeta">
              {bio?.primaryPosition?.name} • {bio?.currentTeam?.name}
            </div>
            <div className="cardMeta">
              B/T: {bio?.batSide?.code}/{bio?.pitchHand?.code} • {bio?.height} •{" "}
              {bio?.weight} lb • Born {bio?.birthDate}
            </div>
          </div>
        </div>
      </div>

      <h2 className="title" style={{ fontSize: 20 }}>
        Stats
      </h2>
      <div className="list">
        <div className="item">
          <div className="cardTitle">Hitting (Season)</div>
          <div className="cardMeta">
            AVG {hittingSeason.avg || "-"} • HR {hittingSeason.homeRuns || 0} •
            RBI {hittingSeason.rbi || 0} • OPS {hittingSeason.ops || "-"}
          </div>
        </div>
        <div className="item">
          <div className="cardTitle">Hitting (Career)</div>
          <div className="cardMeta">
            AVG {hittingCareer.avg || "-"} • HR {hittingCareer.homeRuns || 0} •
            RBI {hittingCareer.rbi || 0} • OPS {hittingCareer.ops || "-"}
          </div>
        </div>
        <div className="item">
          <div className="cardTitle">Pitching (Season)</div>
          <div className="cardMeta">
            ERA {pitchingSeason.era || "-"} • SO{" "}
            {pitchingSeason.strikeOuts || 0} • WHIP {pitchingSeason.whip || "-"}
          </div>
        </div>
        <div className="item">
          <div className="cardTitle">Pitching (Career)</div>
          <div className="cardMeta">
            ERA {pitchingCareer.era || "-"} • SO{" "}
            {pitchingCareer.strikeOuts || 0} • WHIP {pitchingCareer.whip || "-"}
          </div>
        </div>
      </div>
    </main>
  );
}
