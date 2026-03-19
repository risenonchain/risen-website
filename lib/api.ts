const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type StartSessionResponse = {
  session_id: number;
  session_token: string;
  trials_remaining: number;
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
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  level: number;
};

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_token");
}

export function getStoredRushUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("risen_rush_username");
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseApiError(response: Response, fallbackMessage: string) {
  const error = await response.json().catch(() => ({}));
  throw new Error(error.detail || fallbackMessage);
}

export async function registerRushUser(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Registration failed");
  }

  return response.json();
}

export async function loginRushUser(payload: LoginPayload) {
  const formData = new URLSearchParams();
  formData.append("username", payload.email);
  formData.append("password", payload.password);

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    await parseApiError(response, "Login failed");
  }

  return response.json() as Promise<{ access_token: string; token_type: string }>;
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

export async function startRushSession(): Promise<StartSessionResponse> {
  const response = await fetch(`${API_BASE_URL}/rush/session/start`, {
    method: "POST",
    headers: getAuthHeaders(),
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

export async function fetchRushLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${API_BASE_URL}/leaderboard/global`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to fetch leaderboard");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((entry) => ({
    rank: Number(entry.rank ?? 0),
    username: String(entry.username ?? "Unknown"),
    score: Number(entry.score ?? 0),
    level: Number(entry.level ?? 1),
  }));
}

export async function requestRushPasswordReset(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseApiError(response, "Failed to reset password");
  }

  return response.json();
}