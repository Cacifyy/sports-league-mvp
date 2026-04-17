import { useState } from "react";
import { getDivisionLeaders, getStandings } from "../data/standings";
import type { Division, StandingsFilter } from "../data/standings";

const FILTERS: { label: string; value: StandingsFilter["division"] }[] = [
  { label: "All", value: "all" },
  { label: "Casual", value: "casual" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Competitive", value: "competitive" },
];

export default function Standings() {
  const [division, setDivision] = useState<StandingsFilter["division"]>("all");
  const teams = getStandings({ division });
  const leaders = getDivisionLeaders();

  return (
    <div className="page">
      <div className="leaders-grid">
        {(["casual", "intermediate", "competitive"] as Division[]).map((div) => {
          const leader = leaders[div];
          return (
            <div key={div} className="leader-card">
              <div className="div-label">{div} leader</div>
              {leader ? (
                <>
                  <div className="team">{leader.name}</div>
                  <div className="record">{leader.wins}W – {leader.losses}L · {leader.points} pts</div>
                </>
              ) : (
                <div className="team" style={{ color: "var(--muted)" }}>No teams</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="standings-header">
        <h1>Standings</h1>
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={division === f.value ? "active" : ""}
              onClick={() => setDivision(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Team</th>
              <th>W</th>
              <th>L</th>
              <th>GP</th>
              <th>Pts</th>
              <th>Win%</th>
              <th>Streak</th>
              {division === "all" && <th>Division</th>}
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => (
              <tr key={t.name}>
                <td className="rank">{t.rank}</td>
                <td>
                  <div className="team-cell">
                    <span className="team-dot" style={{ background: t.color }} />
                    <div>
                      <div className="team-name">{t.name}</div>
                      <div className="captain">{t.captain}</div>
                    </div>
                  </div>
                </td>
                <td>{t.wins}</td>
                <td>{t.losses}</td>
                <td>{t.gamesPlayed}</td>
                <td>{t.points}</td>
                <td>{(t.winPct * 100).toFixed(1)}%</td>
                <td className={t.streakType === "W" ? "streak-w" : "streak-l"}>
                  {t.streak}
                </td>
                {division === "all" && (
                  <td>
                    <span className={`div-badge div-${t.division}`}>{t.division}</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
