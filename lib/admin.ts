export type AuditLog = {
  id: number;
  action: string;
  actor: string;
  target_user?: string;
  timestamp: string;
  details?: string;
};

export async function fetchAuditLogs(token: string): Promise<AuditLog[]> {
  const res = await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/admin/audit-logs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function unblockPlayer(userId: number, token: string): Promise<void> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_RUSH_API_URL + `/admin/unblock-user/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to unblock player");
}
export async function blockPlayer(userId: number, token: string): Promise<void> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_RUSH_API_URL + `/admin/block-user/${userId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to block player");
}
export type RedemptionRequest = {
  id: number;
  username: string;
  email: string;
  wallet_address: string;
  points_requested: number;
  status: string;
  created_at: string;
  reviewed_at?: string | null;
};

export async function fetchRedemptionRequests(token: string): Promise<RedemptionRequest[]> {
  const res = await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/admin/redemptions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch redemption requests");
  return res.json();
}

export async function updateRedemptionRequestStatus(
  id: number,
  status: string,
  token: string
): Promise<void> {
  const res = await fetch(
    process.env.NEXT_PUBLIC_RUSH_API_URL + `/admin/redemptions/${id}?status=${status}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to update redemption request");
}
