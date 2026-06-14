import type { AuthResponse, DashboardData, Member, ServerInfo } from '../types';

const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request<AuthResponse>('/auth/logout', { method: 'POST' }),

  getMe: () =>
    request<AuthResponse>('/auth/me'),

  // Dashboard
  getDashboard: () =>
    request<DashboardData>('/dashboard/stats'),

  // Members
  getMembers: () =>
    request<{ success: boolean; members: Member[] }>('/members'),

  getMember: (id: number) =>
    request<{ success: boolean; member: Member }>(`/members/${id}`),

  // Server Info
  getServerInfo: () =>
    request<ServerInfo>('/server-info'),
};
