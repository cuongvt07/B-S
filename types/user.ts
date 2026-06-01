export type UserRole = 'user' | 'broker';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  verifiedAt?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
}
