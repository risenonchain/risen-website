const API_BASE_URL =
  process.env.NEXT_PUBLIC_RUSH_API_URL || "http://127.0.0.1:8000";

/* ========================= TYPES ========================= */

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
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type MeResponse = {
  id: number;
  email: string;
  username: string;
};

/* ========================= HELPERS ========================= */

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

async function parseApiError(response: Response, fallback: string) {
  const error = await response.json().catch(() => ({}));
  throw new Error(error.detail || fallback);
}

/* ========================= AUTH ========================= */

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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch user");
  }

  return response.json();
}

export function clearRushAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("risen_rush_token");
}

export function hasRushToken() {
  return !!getStoredToken();
}

/* ========================= GAME ========================= */

export async function startRushSession(): Promise<StartSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/rush/session/start`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({}), // ✅ clean
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
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to finish session");
  }

  return response.json();
}

/* ========================= WALLET ========================= */

export async function fetchRushWallet(): Promise<WalletResponse> {
  const response = await fetch(`${API_BASE_URL}/rush/wallet`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed wallet");
  }

  return response.json();
}