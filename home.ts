// home.ts — Landing page data and logic for DodgeCity League

export interface SeasonInfo {
  season: string;
  gameDay: string;
  location: string;
  registrationCloses: string;
  startDate: string;
}

export interface FeatureStat {
  value: string;
  label: string;
  description: string;
}

export interface CtaBanner {
  heading: string;
  subtext: string;
  buttonLabel: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const seasonInfo: SeasonInfo = {
  season: "Summer 2025",
  gameDay: "Wednesday 6–9 PM",
  location: "Southland Rec Centre",
  registrationCloses: "June 15",
  startDate: "July 2",
};

export const featureStats: FeatureStat[] = [
  {
    value: "3",
    label: "Divisions",
    description: "Casual, intermediate, and competitive. Everyone belongs somewhere.",
  },
  {
    value: "12",
    label: "Teams this season",
    description: "Over 80 players across all divisions last season. Growing every year.",
  },
  {
    value: "10",
    label: "Weeks of play",
    description: "Regular season plus playoffs. Champions earn a real trophy.",
  },
  {
    value: "$80",
    label: "Per player",
    description: "Full season, playoffs included. Team discounts available for 6+.",
  },
];

export const ctaBanner: CtaBanner = {
  heading: "Summer 2025 registration is open",
  subtext: "Spots fill fast — secure your team's place before June 15.",
  buttonLabel: "Register now",
};

// ── Logic ─────────────────────────────────────────────────────────────────────

/**
 * Returns true if registration is still open based on today's date.
 */
export function isRegistrationOpen(closingDateStr: string): boolean {
  const closing = new Date(closingDateStr + " 2025");
  return new Date() < closing;
}

/**
 * Returns the number of days remaining until registration closes.
 * Returns 0 if already closed.
 */
export function daysUntilClose(closingDateStr: string): number {
  const closing = new Date(closingDateStr + " 2025");
  const today = new Date();
  const diff = closing.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Formats the season info strip for display.
 */
export function formatSeasonStrip(info: SeasonInfo): Record<string, string> {
  return {
    Season: info.season,
    Games: info.gameDay,
    Location: info.location,
    "Reg. closes": info.registrationCloses,
  };
}
