// register.ts — Registration page data, types, and logic for DodgeCity League

export type Division = "casual" | "intermediate" | "competitive";
export type RegistrationType = "join" | "new-team" | "free-agent";

export interface DivisionOption {
  id: Division;
  label: string;
  description: string;
}

export interface PricingTier {
  label: string;
  pricePerPlayer: number;
  minimumPlayers?: number;
  note?: string;
}

export interface SeasonDetails {
  gameDay: string;
  location: string;
  seasonStart: string;
  playoffs: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  registrationType: RegistrationType;
  teamName?: string;
  division: Division;
  agreedToWaiver: boolean;
  subscribeToUpdates: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof RegistrationFormData, string>>;
}

// ── Data ──────────────────────────────────────────────────────────────────────

export const divisionOptions: DivisionOption[] = [
  {
    id: "casual",
    label: "Casual",
    description: "Beginners welcome",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Some experience",
  },
  {
    id: "competitive",
    label: "Competitive",
    description: "League veterans",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    label: "Individual",
    pricePerPlayer: 80,
  },
  {
    label: "Team",
    pricePerPlayer: 65,
    minimumPlayers: 6,
    note: "per player, 6 minimum",
  },
];

export const seasonDetails: SeasonDetails = {
  gameDay: "Wednesday 6–9 PM",
  location: "Southland Rec Centre",
  seasonStart: "July 2",
  playoffs: "Sept 10–17",
};

export const includedItems: string[] = [
  "10-week regular season",
  "Playoff bracket entry",
  "Weekly referees provided",
  "Access to post-game socials",
  "End-of-season awards night",
];

// ── Logic ─────────────────────────────────────────────────────────────────────

/**
 * Validates registration form data. Returns a result with field-level errors.
 */
export function validateForm(data: RegistrationFormData): ValidationResult {
  const errors: Partial<Record<keyof RegistrationFormData, string>> = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "A valid email address is required.";
  }

  if (data.phone && !/^[\d\s\(\)\-\+]{7,15}$/.test(data.phone)) {
    errors.phone = "Phone number format is invalid.";
  }

  if (data.registrationType === "new-team" && !data.teamName?.trim()) {
    errors.teamName = "Please provide a team name.";
  }

  if (!data.agreedToWaiver) {
    errors.agreedToWaiver = "You must agree to the participant waiver.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Returns the price per player for a given team size.
 */
export function calculatePricePerPlayer(playerCount: number): number {
  const teamTier = pricingTiers.find((t) => t.minimumPlayers !== undefined);
  if (teamTier && playerCount >= (teamTier.minimumPlayers ?? Infinity)) {
    return teamTier.pricePerPlayer;
  }
  return pricingTiers[0].pricePerPlayer;
}

/**
 * Returns the total cost for a team registration.
 */
export function calculateTeamTotal(playerCount: number): number {
  return calculatePricePerPlayer(playerCount) * playerCount;
}

/**
 * Simulates submitting a registration. Replace with a real API call.
 */
export async function submitRegistration(
  data: RegistrationFormData
): Promise<{ success: boolean; message: string }> {
  const validation = validateForm(data);
  if (!validation.valid) {
    return { success: false, message: "Please fix form errors before submitting." };
  }

  // TODO: replace with actual API endpoint
  console.log("Submitting registration:", data);

  return {
    success: true,
    message: "Registration received! We'll be in touch before the season starts.",
  };
}
