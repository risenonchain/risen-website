const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_RUSH_API_URL) {
    return process.env.NEXT_PUBLIC_RUSH_API_URL;
  }

  if (typeof window !== "undefined") {
    // Check if running in Capacitor
    if ((window as any).Capacitor) {
      return "https://risen-rush-backend.onrender.com";
    }
  }

  return "";
};

export const BASE_URL = getBaseUrl();

/* =========================
   TYPES
========================= */

export type MeResponse = {
  id: string;
  username: string;
  email: string;
  wallet_address?: string;
  avatar_url?: string;
  generated_avatar_url?: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
  is_premium?: boolean;
};

export type ProfileStatsResponse = {
  best_score?: number;
  best_level?: number;
  vault_trials?: number;
  available_points?: number;
  total_sessions?: number;
  total_points_earned?: number;
  claimed_points?: number;
  is_premium?: boolean;
  premium_until?: string;
  wallet_address?: string;
  avatar_url?: string;
  generated_avatar_url?: string;
  username?: string;
  email?: string;
  score_rank?: number;
  level_rank?: number;
};

export type RedemptionRequestResponse = {
  id: string;
  username_snapshot?: string;
  email_snapshot?: string;
  wallet_address_snapshot?: string;
  points_requested: number;
  status: string;
  created_at: string;
  reviewed_at?: string | null;
};

export type ReferralInfoResponse = {
  referral_code: string;
  referral_link?: string;
  successful_referrals?: number;
  vault_trials?: number;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

export type ForgotPasswordResponse = {
  message: string;
  reset_token?: string | null;
  expires_at?: string | null;
};

export type WalletResponse = {
  total_points_earned: number;
  available_points: number;
  claimed_points: number;
  vault_trials: number;
};

export type StartRushSessionResponse = {
  session_id: number;
  session_token: string;
  trials_remaining: number;
  daily_trials_remaining?: number;
  vault_trials_remaining?: number;
  starting_lives: number;
  trial_source?: string;
};

export type FinishRushSessionResponse = {
  message: string;
  points_added: number;
  wallet_points: number;
};

/* =========================
   AUTH STORAGE
========================= */

const TOKEN_KEY = "rush_token";

export function saveRushAuth(token: string, username?: string) {
  localStorage.setItem(TOKEN_KEY, token);

  if (typeof window !== "undefined" && username) {
    localStorage.setItem("risen_rush_username", username);
  }
}

export function clearRushAuth() {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasRushToken() {
  return !!localStorage.getItem(TOKEN_KEY);
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/* =========================
   BASE REQUEST
========================= */

export const APP_VERSION = "1.1.0";

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-App-Version": APP_VERSION,
      "X-Platform": (window as any).Capacitor ? "android" : "web",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const raw = await res.text();

  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!res.ok) {
    const message =
      typeof data === "object" && data?.detail
        ? data.detail
        : typeof data === "string" && data
          ? data
          : "Request failed";
    throw new Error(message);
  }

  return data;
}

/* =========================
   HELPERS
========================= */

function mapLeaderboard(data: any[]): LeaderboardEntry[] {
  return data.map((item, index) => ({
    rank: item.rank ?? index + 1,
    username: item.username ?? item.user ?? "Unknown",
    score: item.score ?? 0,
    level: item.level ?? 1,
    is_premium: !!item.is_premium,
  }));
}

/* =========================
   AUTH
========================= */

export async function registerRushUser(
  data: {
    username: string;
    email: string;
    password: string;
    referral_code?: string;
  },
  turnstileToken?: string | null
) {
  return request("/auth/register", {
    method: "POST",
    headers: {
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: JSON.stringify(data),
  });
}

export async function loginRushUser(
  data: {
    email: string;
    password: string;
  },
  turnstileToken?: string | null
) {
  // Use a raw string for body to avoid issues with URLSearchParams in some native environments
  const body = `username=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-App-Version": APP_VERSION,
        "X-Platform": (window as any).Capacitor ? "android" : "web",
        ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
      },
      body: body,
    });

    const raw = await res.text();

    let parsed: any = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = raw;
    }

    if (!res.ok) {
      const message =
        typeof parsed === "object" && parsed?.detail
          ? parsed.detail
          : typeof parsed === "string" && parsed
            ? parsed
            : "Login failed";
      throw new Error(message);
    }

    return parsed;
  } catch (err) {
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error("Network error: Backend unreachable. Please check your internet connection or backend CORS settings.");
    }
    // Handle the "unexpected end of stream" or similar native errors specifically if possible
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes("unexpected end of stream")) {
        throw new Error("Connection interrupted by network or server. Please try again.");
    }
    throw err;
  }
}

export async function fetchCurrentRushUser(): Promise<MeResponse> {
  return request("/auth/me");
}

/* =========================
   PASSWORD
========================= */

export async function requestRushPasswordReset(
  payload: { email: string }
): Promise<ForgotPasswordResponse> {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetRushPassword(data: {
  token: string;
  new_password: string;
}) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function changeRushPassword(payload: ChangePasswordPayload) {
  return request("/profile/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================
   GAME
========================= */

export async function startRushSession(): Promise<StartRushSessionResponse> {
  return request("/rush/session/start", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function finishRushSession(payload: {
  session_id: number;
  final_score: number;
  duration_seconds: number;
  level_reached: number;
  lives_remaining: number;
}): Promise<FinishRushSessionResponse> {
  return request("/rush/session/finish", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* =========================
   WALLET
========================= */

export async function fetchRushWallet(): Promise<WalletResponse> {
  return request("/rush/wallet");
}

/* =========================
   PROFILE
========================= */

export async function updateRushProfile(data: {
  username?: string;
  wallet_address?: string | null;
  avatar_url?: string | null;
  generated_avatar_url?: string | null;
}) {
  return request("/profile/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchRushProfileStats(): Promise<ProfileStatsResponse> {
  const data = await request("/profile/stats");

  return {
    ...data,
    best_score: data?.best_score ?? 0,
  };
}

export async function fetchRushReferralInfo(): Promise<ReferralInfoResponse> {
  return request("/profile/referral");
}

/* =========================
   REDEMPTION
========================= */

export async function createRedemptionRequest(data: {
  wallet_address: string;
  points_requested: number;
}) {
  return request("/profile/redemptions/request", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMyRedemptionRequests(): Promise<
  RedemptionRequestResponse[]
> {
  return request("/profile/redemptions");
}

export async function claimAdReward(): Promise<WalletResponse> {
  return request("/rush/ads/claim-reward", {
    method: "POST",
    body: JSON.stringify({}), // Added empty body for strict backend parsers
  });
}

/* =========================
   LEADERBOARD
========================= */

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/global");
  return mapLeaderboard(data);
}

export async function fetchRushTopScoreLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/top-score");
  return mapLeaderboard(data);
}

export async function fetchRushTopLevelLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/top-level");
  return mapLeaderboard(data);
}

/* =========================
   TURNSTILE
========================= */

export function getTurnstileSiteKey() {
  // Use a variable that is definitely visible to the client
  const enabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED;
  if (enabled === "false" || enabled === "False") {
    return "";
  }

  const envKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (envKey) return envKey;

  // If we are on app.risenonchain.net, the hardcoded key MUST be whitelisted for it
  if (typeof window !== "undefined" && (window as any).Capacitor) {
    return "0x4AAAAAACyq8KO_Awc5gL-A";
  }

  return "";
}
