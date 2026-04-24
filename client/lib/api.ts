export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface RequestRecord {
  _id: string;
  name: string;
  email: string;
  message: string;
  category: 'billing' | 'support' | 'feedback' | 'general' | null;
  summary: string | null;
  urgency: 'low' | 'medium' | 'high' | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: RequestRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchRequests(
  page = 1,
  limit = 10,
  category?: string,
): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (category && category !== 'all') params.set('category', category);

  const res = await fetch(`${API_BASE}/requests?${params}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
  return res.json();
}

export async function deleteRequest(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/requests/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete request: ${res.status}`);
}

export async function submitRequest(data: {
  name: string;
  email: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message?.[0] ?? 'Something went wrong. Please try again.');
  }

  return res.json();
}