const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/* =========================
   TYPES
========================= */

export type MeResponse = {
  id: string;
  username: string;
  email: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
};

export type ProfileStatsResponse = {
  total_games: number;
  high_score: number;
  total_points: number;
};

export type RedemptionRequestResponse = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
};

export type ReferralInfoResponse = {
  referral_code: string;
  total_referrals: number;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
};

export type ForgotPasswordResponse = {
  message: string;
  reset_token?: string | null;
  expires_at?: string | null;
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

/* =========================
   AUTH
========================= */

export async function registerRushUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  return request("/auth/register/", {
    method: "POST",
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
      ...(turnstileToken
        ? { "X-Turnstile-Token": turnstileToken }
        : {}),
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
   GAME SESSION
========================= */

export async function startRushSession() {
  return request("/game/start/", { method: "POST" });
}

export async function finishRushSession(data: {
  score: number;
  level: number;
}) {
  return request("/game/finish/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/* =========================
   WALLET
========================= */

export async function fetchRushWallet() {
  return request("/wallet/");
}

/* =========================
   PROFILE
========================= */

export async function updateRushProfile(data: {
  username?: string;
}) {
  return request("/profile/update/", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchRushProfileStats(): Promise<ProfileStatsResponse> {
  return request("/profile/stats/");
}

export async function fetchRushReferralInfo(): Promise<ReferralInfoResponse> {
  return request("/profile/referral/");
}

/* =========================
   REDEMPTION
========================= */

export async function createRedemptionRequest(amount: number) {
  return request("/wallet/redeem/", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

export async function fetchMyRedemptionRequests(): Promise<RedemptionRequestResponse[]> {
  return request("/wallet/redemptions/");
}

/* =========================
   LEADERBOARD
========================= */

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/");
  return mapLeaderboard(data);
}

export async function fetchRushTopScoreLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/top-score/");
  return mapLeaderboard(data);
}

export async function fetchRushTopLevelLeaderboard(): Promise<LeaderboardEntry[]> {
  const data = await request("/leaderboard/top-level/");
  return mapLeaderboard(data);
}

/* =========================
   TURNSTILE
========================= */

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}