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

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Registration failed");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Login failed");
  }

  return response.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function fetchCurrentRushUser(): Promise<MeResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch current user");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to start session");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to finish session");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch wallet");
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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to fetch leaderboard");
  }

  return response.json();
}