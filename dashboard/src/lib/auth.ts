import type { User, UserRole } from './types';

export const ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

const ACCESS_TOKEN_KEY = 'alshisr_access_token';
const REFRESH_TOKEN_KEY = 'alshisr_refresh_token';
const USER_KEY = 'alshisr_user';

export function isAdminRole(role: UserRole) {
  return ADMIN_ROLES.includes(role);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(
  accessToken: string,
  refreshToken: string,
  user: User,
) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  document.cookie = `alshisr_auth=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  document.cookie = `alshisr_access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'alshisr_auth=; path=/; max-age=0';
  document.cookie = 'alshisr_access_token=; path=/; max-age=0';
}

export function isAuthenticated(): boolean {
  return !!getAccessToken() && !!getStoredUser();
}

export function isAdmin(): boolean {
  const user = getStoredUser();
  return user ? isAdminRole(user.role) : false;
}
