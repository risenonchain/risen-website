const BASE_URL = process.env.NEXT_PUBLIC_RUSH_API_URL || "";

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
};

export type ProfileStatsResponse = {
  total_games?: number;
  best_score?: number;
  best_level?: number;
  vault_trials?: number;
  available_points?: number;
  total_sessions?: number;
  total_points_earned?: number;
  claimed_points?: number;

  wallet_address?: string;
  avatar_url?: string;
  generated_avatar_url?: string;

  username?: string;
  email?: string;
};

export type RedemptionRequestResponse = {
  id: string;
  points_requested: number;
  status: string;
  created_at: string;
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

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
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
  }));
}

function getOrCreateDeviceFingerprint(): string {
  if (typeof window === "undefined") {
    return "server-render";
  }

  const key = "risen_rush_device_fingerprint";
  const existing = localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const fingerprint =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `rush_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

  localStorage.setItem(key, fingerprint);
  return fingerprint;
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
  return request("/auth/register/", {
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
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function fetchCurrentRushUser(): Promise<MeResponse> {
  return request("/auth/me/");
}

/* =========================
   PASSWORD
========================= */

export async function requestRushPasswordReset(
  payload: { email: string }
): Promise<ForgotPasswordResponse> {
  return request("/auth/password/reset/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetRushPassword(data: {
  token: string;
  new_password: string;
}) {
  return request("/auth/password/reset/confirm/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function changeRushPassword(payload: ChangePasswordPayload) {
  return request("/auth/password/change/", {
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
    body: JSON.stringify({
      device_fingerprint: getOrCreateDeviceFingerprint(),
    }),
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
    body: JSON.stringify({
      ...payload,
      device_fingerprint: getOrCreateDeviceFingerprint(),
    }),
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
  return request("/profile/update/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchRushProfileStats(): Promise<ProfileStatsResponse> {
  const data = await request("/profile/stats/");

  return {
    ...data,
    best_score: data.best_score ?? data.high_score ?? 0,
  };
}

export async function fetchRushReferralInfo(): Promise<ReferralInfoResponse> {
  return request("/profile/referral/");
}

/* =========================
   REDEMPTION
========================= */

export async function createRedemptionRequest(data: {
  wallet_address: string;
  points_requested: number;
}) {
  return request("/wallet/redeem/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchMyRedemptionRequests(): Promise<
  RedemptionRequestResponse[]
> {
  return request("/wallet/redemptions/");
}

/* =========================
   LEADERBOARD
========================= */

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/");
  return mapLeaderboard(data);
}

export async function fetchRushTopScoreLeaderboard(): Promise<
  LeaderboardEntry[]
> {
  const data = await request("/leaderboard/top-score/");
  return mapLeaderboard(data);
}

export async function fetchRushTopLevelLeaderboard(): Promise<
  LeaderboardEntry[]
> {
  const data = await request("/leaderboard/top-level/");
  return mapLeaderboard(data);
}

/* =========================
   TURNSTILE
========================= */

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}
