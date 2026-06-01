/**
 * Mock session helpers.
 *
 * Tokens are NOT cryptographically signed — purely demo. Format:
 *   `mock-jwt.<base64(userId)>.signature`
 *
 * Replace this whole module with real Bearer/JWT verification when wiring Laravel.
 */
import type { User } from '@/types';
import { userById, SEED_PASSWORD } from './data/users';

export { SEED_PASSWORD };

export const SESSION_COOKIE_NAME = 'bds_session';

export function createToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ userId })).toString('base64');
  return `mock-jwt.${payload}.signature`;
}

export function decodeToken(token: string): { userId: string } | null {
  if (!token.startsWith('mock-jwt.')) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    return payload?.userId ? { userId: payload.userId } : null;
  } catch {
    return null;
  }
}

export function authenticate(email: string, password: string): User | null {
  if (password !== SEED_PASSWORD) return null;
  const user = Array.from(userById.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  return user ?? null;
}

export function userFromToken(token: string | undefined | null): User | null {
  if (!token) return null;
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return userById.get(decoded.userId) ?? null;
}
