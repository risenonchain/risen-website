const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Check if running in Capacitor
    if ((window as any).Capacitor) {
      // Prioritize live backend for native app
      return "https://risen-rush-backend.onrender.com";
    }
  }

  if (process.env.NEXT_PUBLIC_RUSH_API_URL) {
    return process.env.NEXT_PUBLIC_RUSH_API_URL;
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
  is_premium?: boolean;
  premium_expires_at?: string;
};

export type LeagueChallengeOut = {
  id: number;
  league_id: number;
  challenger_id: number;
  challenger_username?: string;
  challenged_id: number;
  challenged_username?: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  expires_at: string;
};

export type AnnouncementResponse = {
  id: number;
  message: string;
  is_active: boolean;
  created_at: string;
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

export type HistoryEntry = {
  month: string;
  best_score: number;
  best_level: number;
};

export type HistoryResponse = HistoryEntry[];

export type StartRushSessionResponse = {
  session_id: number;
  session_token: string;
  trials_remaining: number;
  daily_trials_remaining?: number;
  vault_trials_remaining?: number;
  starting_lives: number;
  trial_source?: string;
};

export type GuardianContractScanResponse = {
  id: number;
  address: string;
  network: string;
  risk_score?: number;
  is_honeypot?: boolean;
  buy_tax?: number;
  sell_tax?: number;
  owner_address?: string;
  is_proxy?: boolean;
  has_mint_function?: boolean;
  is_open_source?: boolean;
  created_at: string;
};

export type GuardianWatchlistResponse = {
  id: number;
  target_address: string;
  target_type: string;
  label?: string;
  is_active: boolean;
  created_at: string;
};

export type GuardianAlertResponse = {
  id: number;
  severity: string;
  category: string;
  title: string;
  message: string;
  related_address?: string;
  is_read: boolean;
  created_at: string;
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
    let message = "Request failed";
    if (typeof data === "object" && data !== null) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Handle validation errors from FastAPI
        message = data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
      } else if (data.detail) {
        message = JSON.stringify(data.detail);
      } else if (data.message) {
        message = data.message;
      }
    } else if (typeof data === "string" && data) {
      message = data;
    }
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
    agreed_to_terms: boolean;
    marketing_consent: boolean;
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
  // Try sending Turnstile in both header and body for maximum compatibility
  let body = `username=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`;
  if (turnstileToken) {
    body += `&turnstile_token=${encodeURIComponent(turnstileToken)}`;
  }

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

export async function fetchRushUsers(): Promise<MeResponse[]> {
  return request("/rush/players");
}

export async function fetchMyChallenges(): Promise<LeagueChallengeOut[]> {
  return request("/league/challenges/my");
}

export async function sendLeagueChallenge(data: {
  league_id: number;
  challenged_id: number;
  scheduled_at: string;
}) {
  return request("/league/challenges/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function respondToChallenge(challengeId: number, action: "accept" | "reject") {
  return request(`/league/challenges/${challengeId}/respond`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}

export async function fetchActiveAnnouncement(): Promise<AnnouncementResponse | null> {
  return request("/announcements/active");
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
   LEAGUE SESSIONS
========================= */

export async function startLeagueSession(matchId: number): Promise<StartRushSessionResponse> {
  return request(`/rush/league/session/start?match_id=${matchId}`, {
    method: "POST",
  });
}

export async function finishLeagueSession(payload: {
  session_id: number;
  final_score: number;
  duration_seconds: number;
  level_reached: number;
  lives_remaining: number;
}) {
  return request("/rush/league/session/finish", {
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

export async function fetchMyNeuralHistory(): Promise<HistoryResponse> {
  return request("/profile/history");
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
   GUARDIAN
========================= */

export async function scanContract(address: string, network: string = "bsc"): Promise<GuardianContractScanResponse> {
  return request(`/guardian/scan/${address}?network=${network}`);
}

export async function scanWalletDust(address: string, network: string = "bsc"): Promise<any[]> {
  return request(`/sweeper/scan?address=${address}&chain=${network}`);
}

export async function convertDust(address: string, tokens: string[]): Promise<any> {
  return request(`/sweeper/convert?address=${address}`, {
    method: "POST",
    body: JSON.stringify(tokens)
  });
}

export async function fetchGuardianWatchlist(): Promise<GuardianWatchlistResponse[]> {
  return request("/guardian/watchlist");
}

export async function addToGuardianWatchlist(data: {
  target_address: string;
  target_type: "contract" | "wallet";
  label?: string;
}): Promise<GuardianWatchlistResponse> {
  return request("/guardian/watchlist", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchGuardianAlerts(unreadOnly = false): Promise<GuardianAlertResponse[]> {
  return request(`/guardian/alerts?unread_only=${unreadOnly}`);
}

export async function markGuardianAlertRead(alertId: number) {
  return request(`/guardian/alerts/${alertId}/read`, {
    method: "PATCH",
  });
}

export type GuardianStatsResponse = {
  total_scans: number;
  active_alerts: number;
  monitored_assets: number;
  safety_score: string;
};

export async function fetchGuardianStats(): Promise<GuardianStatsResponse> {
  return request("/guardian/stats");
}

export async function explainGuardianScan(scanId: number): Promise<{ explanation: string }> {
  return request(`/guardian/scan/${scanId}/explain`);
}

export async function analyzeWallet(address: string): Promise<any> {
  return request(`/guardian/wallet/analyze/${address}`);
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
