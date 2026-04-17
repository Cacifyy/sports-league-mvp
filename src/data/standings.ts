// standings.ts — Standings page data, types, and logic for DodgeCity League

export type Division = "casual" | "intermediate" | "competitive";
export type StreakType = "W" | "L";

export interface Team {
  name: string;
  captain: string;
  wins: number;
  losses: number;
  division: Division;
  color: string;
  streak: string; // e.g. "W3", "L2"
}

export interface RankedTeam extends Team {
  rank: number;
  points: number;
  gamesPlayed: number;
  winPct: number;
  streakType: StreakType;
  streakCount: number;
}

export interface StandingsFilter {
  division: Division | "all";
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const teams: Team[] = [
  { name: "The Untouchables", captain: "Sarah M.",   wins: 8, losses: 1, division: "competitive",   color: "#C93535", streak: "W3" },
  { name: "Dodge & Chill",    captain: "Marcus T.",  wins: 7, losses: 2, division: "intermediate",  color: "#378ADD", streak: "W2" },
  { name: "Ball Busters",     captain: "Priya K.",   wins: 6, losses: 2, division: "competitive",   color: "#C93535", streak: "L1" },
  { name: "Here for the Beer",captain: "Jamie R.",   wins: 6, losses: 3, division: "casual",        color: "#639922", streak: "W4" },
  { name: "Catch Me If You Can", captain: "Devon L.",wins: 5, losses: 3, division: "intermediate",  color: "#378ADD", streak: "W1" },
  { name: "The Flinchers",    captain: "Aisha N.",   wins: 5, losses: 4, division: "casual",        color: "#639922", streak: "L2" },
  { name: "Send It",          captain: "Tom B.",     wins: 4, losses: 4, division: "intermediate",  color: "#378ADD", streak: "W1" },
  { name: "No Ragrets",       captain: "Chloe S.",   wins: 3, losses: 5, division: "casual",        color: "#639922", streak: "L1" },
  { name: "Dodge City OGs",   captain: "Raj P.",     wins: 3, losses: 6, division: "competitive",   color: "#C93535", streak: "L3" },
  { name: "Winging It",       captain: "Emma V.",    wins: 2, losses: 7, division: "casual",        color: "#639922", streak: "L2" },
  { name: "Pain Train",       captain: "Chris O.",   wins: 1, losses: 8, division: "intermediate",  color: "#378ADD", streak: "L5" },
  { name: "Slow Rollers",     captain: "Nina F.",    wins: 1, losses: 8, division: "casual",        color: "#639922", streak: "W1" },
];

// Points system: 3 pts per win
const POINTS_PER_WIN = 3;

// ── Logic ─────────────────────────────────────────────────────────────────────

/**
 * Parses a streak string like "W3" or "L2" into its type and count.
 */
export function parseStreak(streak: string): { type: StreakType; count: number } {
  const type = streak.charAt(0) as StreakType;
  const count = parseInt(streak.slice(1), 10);
  return { type, count };
}

/**
 * Computes derived fields for a team and returns a RankedTeam.
 * Rank is assigned after sorting, so pass 0 initially.
 */
export function enrichTeam(team: Team, rank: number): RankedTeam {
  const gamesPlayed = team.wins + team.losses;
  const points = team.wins * POINTS_PER_WIN;
  const winPct = gamesPlayed > 0 ? team.wins / gamesPlayed : 0;
  const { type: streakType, count: streakCount } = parseStreak(team.streak);

  return {
    ...team,
    rank,
    points,
    gamesPlayed,
    winPct: Math.round(winPct * 1000) / 1000,
    streakType,
    streakCount,
  };
}

/**
 * Returns teams sorted by points (desc), then win% (desc), then fewest losses (asc).
 */
export function sortTeams(input: Team[]): Team[] {
  return [...input].sort((a, b) => {
    const ptsA = a.wins * POINTS_PER_WIN;
    const ptsB = b.wins * POINTS_PER_WIN;
    if (ptsB !== ptsA) return ptsB - ptsA;

    const gA = a.wins + a.losses;
    const gB = b.wins + b.losses;
    const pctA = gA > 0 ? a.wins / gA : 0;
    const pctB = gB > 0 ? b.wins / gB : 0;
    if (pctB !== pctA) return pctB - pctA;

    return a.losses - b.losses;
  });
}

/**
 * Filters teams by division. Pass "all" to return every team.
 */
export function filterByDivision(input: Team[], division: Division | "all"): Team[] {
  if (division === "all") return input;
  return input.filter((t) => t.division === division);
}

/**
 * Returns a fully ranked and enriched standings list for a given division filter.
 */
export function getStandings(filter: StandingsFilter): RankedTeam[] {
  const filtered = filterByDivision(teams, filter.division);
  const sorted = sortTeams(filtered);
  return sorted.map((team, index) => enrichTeam(team, index + 1));
}

/**
 * Returns the current division leaders (top team per division).
 */
export function getDivisionLeaders(): Record<Division, RankedTeam | null> {
  const divisions: Division[] = ["casual", "intermediate", "competitive"];
  const leaders = {} as Record<Division, RankedTeam | null>;

  for (const div of divisions) {
    const standings = getStandings({ division: div });
    leaders[div] = standings[0] ?? null;
  }

  return leaders;
}

/**
 * Returns teams currently on a winning streak of N or more games.
 */
export function getHotTeams(minStreak: number = 3): RankedTeam[] {
  return getStandings({ division: "all" }).filter(
    (t) => t.streakType === "W" && t.streakCount >= minStreak
  );
}
