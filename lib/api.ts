const API_BASE_URL =
  process.env.NEXT_PUBLIC_RUSH_API_URL || "http://127.0.0.1:8000";

/* ================= TYPES ================= */

export type StartSessionResponse = {
  session_id: number;
  session_token: string;
  trials_remaining: number;
  daily_trials_remaining: number;
  vault_trials_remaining: number;
  starting_lives: number;
};

export type FinishSessionPayload = {
  session_id: number;
  final_score: number;
  duration_seconds: number;
  level_reached: number;
  lives_remaining: number;
};

export type WalletResponse = {
  total_points_earned: number;
  available_points: number;
  claimed_points: number;
  vault_trials: number;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  referral_code?: string | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  new_password: string;
};

export type MessageResponse = {
  message: string;
};

export type MeResponse = {
  id: number;
  email: string;
  username: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
};

export type RedemptionRequestPayload = {
  wallet_address: string;
  points_requested: number;
};

export type RedemptionRequestResponse = {
  id: number;
  username_snapshot: string;
  email_snapshot: string;
  wallet_address_snapshot: string;
  points_requested: number;
  status: string;
  created_at: string;
};

/* ================= HELPERS ================= */

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_token");
}

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}

function getAuthHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const token = getStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

async function parseApiError(res: Response, fallback: string) {
  const err = await res.json().catch(() => ({}));
  throw new Error(err.detail || fallback);
}

function mapLeaderboardEntries(data: any[]): LeaderboardEntry[] {
  return data.map((e) => ({
    rank: e.rank ?? 0,
    username: e.username ?? "Unknown",
    score: e.score ?? 0,
    level: e.level ?? 1,
  }));
}

/* ================= AUTH ================= */

export async function registerRushUser(
  payload: RegisterPayload,
  turnstileToken?: string | null
) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) await parseApiError(res, "Registration failed");
  return res.json();
}

export async function loginRushUser(
  payload: LoginPayload,
  turnstileToken?: string | null
) {
  const form = new URLSearchParams();
  form.append("username", payload.email);
  form.append("password", payload.password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: form.toString(),
  });

  if (!res.ok) await parseApiError(res, "Login failed");
  return res.json();
}

export async function fetchCurrentRushUser(): Promise<MeResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) await parseApiError(res, "Fetch user failed");
  return res.json();
}

export function clearRushAuth() {
  localStorage.removeItem("risen_rush_token");
}

export function hasRushToken() {
  return !!getStoredToken();
}

/* ================= GAME ================= */

export async function startRushSession(): Promise<StartSessionResponse> {
  const res = await fetch(`${API_BASE_URL}/rush/session/start`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });

  if (!res.ok) await parseApiError(res, "Start failed");
  return res.json();
}

export async function finishRushSession(payload: FinishSessionPayload) {
  const res = await fetch(`${API_BASE_URL}/rush/session/finish`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) await parseApiError(res, "Finish failed");
  return res.json();
}

/* ================= WALLET ================= */

export async function fetchRushWallet(): Promise<WalletResponse> {
  const res = await fetch(`${API_BASE_URL}/rush/wallet`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) await parseApiError(res, "Wallet failed");
  return res.json();
}

/* ================= LEADERBOARD ================= */

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE_URL}/leaderboard/global`);
  if (!res.ok) await parseApiError(res, "Leaderboard failed");
  return mapLeaderboardEntries(await res.json());
}

export async function fetchRushTopScoreLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE_URL}/leaderboard/top-score`);
  if (!res.ok) await parseApiError(res, "Top score failed");
  return mapLeaderboardEntries(await res.json());
}

export async function fetchRushTopLevelLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE_URL}/leaderboard/top-level`);
  if (!res.ok) await parseApiError(res, "Top level failed");
  return mapLeaderboardEntries(await res.json());
}

/* ================= PROFILE ================= */

export async function createRedemptionRequest(
  payload: RedemptionRequestPayload
) {
  const res = await fetch(`${API_BASE_URL}/profile/redemptions/request`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) await parseApiError(res, "Redemption failed");
  return res.json();
}

export async function fetchMyRedemptionRequests() {
  const res = await fetch(`${API_BASE_URL}/profile/redemptions`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) await parseApiError(res, "Fetch redemptions failed");
  return res.json();
}