export interface User {
  id: number;
  username: string;
  role: string;
  loginTime?: string;
}

export interface Member {
  id: number;
  nim: string;
  nama: string;
  email: string;
  prodi: string;
  kelas: string;
  foto: string;
  bio?: string;
  role_kelompok?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface ServerInfo {
  success: boolean;
  serverId: string;
  serverName: string;
  hostname: string;
  timestamp: string;
  uptime: string;
  memoryUsage?: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
}

export interface DashboardStats {
  totalMembers: number;
  totalUsers: number;
}

export interface DashboardData {
  stats: DashboardStats;
  members: Member[];
  serverId: string;
  serverName: string;
  nodeVersion: string;
  environment: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface ApiError {
  success: boolean;
  message: string;
}
