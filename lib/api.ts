const API_BASE_URL =
  process.env.NEXT_PUBLIC_RUSH_API_URL || "http://127.0.0.1:8000";

/* ======================================================
   TYPES
====================================================== */

export type StartSessionResponse = {
  session_id: number;
  session_token: string;
  trials_remaining: number;
  daily_trials_remaining: number;
  vault_trials_remaining: number;
  starting_lives: number;
  trial_source?: string | null;
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

export type ForgotPasswordResponse = {
  message: string;
  reset_token?: string | null;
  expires_at?: string | null;
};

export type MessageResponse = {
  message: string;
};

export type MeResponse = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  email_verified: boolean;
  referral_code?: string | null;
  wallet_address?: string | null;
  avatar_url?: string | null;
  generated_avatar_url?: string | null;
  vault_trials?: number;
  is_admin?: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
};

export type ProfileStatsResponse = {
  username: string;
  email: string;
  wallet_address?: string | null;
  avatar_url?: string | null;
  generated_avatar_url?: string | null;
  vault_trials: number;
  best_score: number;
  best_level: number;
  total_sessions: number;
  total_points_earned: number;
  available_points: number;
  claimed_points: number;
};

export type ReferralInfoResponse = {
  referral_code: string;
  referral_link: string;
  vault_trials: number;
  successful_referrals: number;
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
  reviewed_at?: string | null;
};

export type UpdateProfilePayload = {
  username?: string | null;
  wallet_address?: string | null;
  avatar_url?: string | null;
  generated_avatar_url?: string | null;
};

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
};

/* ======================================================
   STORAGE HELPERS
====================================================== */

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_token");
}

export function getStoredRushUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_username");
}

export function getStoredDeviceFingerprint() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_device_fingerprint");
}

export function getOrCreateDeviceFingerprint() {
  if (typeof window === "undefined") return "server-device";

  const existing = localStorage.getItem("risen_rush_device_fingerprint");
  if (existing) return existing;

  const seed = [
    navigator.userAgent,
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen.width,
    screen.height,
    navigator.platform,
    crypto.randomUUID(),
  ].join("|");

  const fingerprint = `rr_${btoa(seed)
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 64)}`;

  localStorage.setItem("risen_rush_device_fingerprint", fingerprint);
  return fingerprint;
}

export function getTurnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}

/* ======================================================
   HELPERS
====================================================== */

function getAuthHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const token = getStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders || {}),
  };
}

async function parseApiError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => ({}));
  throw new Error(error.detail || fallbackMessage);
}

function mapLeaderboardEntries(data: unknown): LeaderboardEntry[] {
  if (!Array.isArray(data)) return [];

  return data.map((entry) => ({
    rank: Number((entry as any).rank ?? 0),
    username: String((entry as any).username ?? "Unknown"),
    score: Number((entry as any).score ?? 0),
    level: Number((entry as any).level ?? 1),
  }));
}

/* ======================================================
   AUTH
====================================================== */

export async function registerRushUser(
  payload: RegisterPayload,
  turnstileToken?: string | null
) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Registration failed");
  }

  return response.json();
}

export async function loginRushUser(
  payload: LoginPayload,
  turnstileToken?: string | null
) {
  const formData = new URLSearchParams();
  formData.append("username", payload.email);
  formData.append("password", payload.password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(turnstileToken ? { "X-Turnstile-Token": turnstileToken } : {}),
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    await parseApiError(response, "Login failed");
  }

  return response.json();
}

export async function fetchCurrentRushUser(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch current user");
  }

  return response.json();
}

export function saveRushAuth(token: string, username: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("risen_rush_token", token);
  localStorage.setItem("risen_rush_username", username);
}

export function clearRushAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("risen_rush_token");
  localStorage.removeItem("risen_rush_username");
}

export function hasRushToken() {
  return !!getStoredToken();
}

/* ======================================================
   GAME
====================================================== */

export async function startRushSession(): Promise<StartSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/rush/session/start`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      device_fingerprint: getOrCreateDeviceFingerprint(),
    }),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to start session");
  }

  return response.json();
}

export async function finishRushSession(payload: FinishSessionPayload) {
  const response = await fetch(`${API_BASE_URL}/rush/session/finish`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...payload,
      device_fingerprint: getOrCreateDeviceFingerprint(),
    }),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to finish session");
  }

  return response.json();
}

/* ======================================================
   WALLET
====================================================== */

export async function fetchRushWallet(): Promise<WalletResponse> {
  const response = await fetch(`${API_BASE_URL}/rush/wallet`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch wallet");
  }

  return response.json();
}

/* ======================================================
   LEADERBOARD
====================================================== */

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/leaderboard/global`);
  if (!response.ok) {
    await parseApiError(response, "Failed leaderboard");
  }
  return mapLeaderboardEntries(await response.json());
}

/* ======================================================
   PROFILE + EXTRA FEATURES
====================================================== */

export async function fetchRushProfileStats(): Promise<ProfileStatsResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/stats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed profile stats");
  }
  return response.json();
}

export async function fetchRushReferralInfo(): Promise<ReferralInfoResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/referral`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed referral info");
  }
  return response.json();
}

export async function updateRushProfile(
  payload: UpdateProfilePayload
): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/me`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed update profile");
  }
  return response.json();
}

export async function changeRushPassword(
  payload: ChangePasswordPayload
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed change password");
  }
  return response.json();
}

export async function createRedemptionRequest(
  payload: RedemptionRequestPayload
): Promise<RedemptionRequestResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/redemptions/request`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed redemption");
  }
  return response.json();
}

export async function fetchMyRedemptionRequests(): Promise<
  RedemptionRequestResponse[]
> {
  const response = await fetch(`${API_BASE_URL}/profile/redemptions`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    await parseApiError(response, "Failed redemption list");
  }
  return response.json();
}


/* ======================================================
   EXTRA: LEADERBOARD VARIANTS
====================================================== */

export async function fetchRushTopScoreLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/leaderboard/top-score`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch top score leaderboard");
  }

  return mapLeaderboardEntries(await response.json());
}

export async function fetchRushTopLevelLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/leaderboard/top-level`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch top level leaderboard");
  }

  return mapLeaderboardEntries(await response.json());
}

/* ======================================================
   EXTRA: PASSWORD RESET FLOW
====================================================== */

export async function requestRushPasswordReset(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to request password reset");
  }

  return response.json();
}

export async function resetRushPassword(
  payload: ResetPasswordPayload
): Promise<MessageResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to reset password");
  }

  return response.json();
}
