export const DEFAULT_USERNAME = import.meta.env.VITE_DEFAULT_USERNAME ?? "dezprox";
export const DEFAULT_PASSWORD = import.meta.env.VITE_DEFAULT_PASSWORD ?? "dezprox@2025";
export const ALLOWED_GOOGLE_EMAIL = import.meta.env.VITE_ALLOWED_GOOGLE_EMAIL ?? "owner@example.com";

const AUTH_KEY = "auth:isAuthenticated";
const USER_KEY = "auth:user";

export function isAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function getAuthUser(): string | null {
  try {
    return localStorage.getItem(USER_KEY);
  } catch {
    return null;
  }
}

export function loginWithCredentials(username: string, password: string): boolean {
  if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
    try {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(USER_KEY, username);
    } catch {}
    return true;
  }
  return false;
}

export function loginWithGoogleEmail(email: string): boolean {
  if (email && email.toLowerCase() === ALLOWED_GOOGLE_EMAIL.toLowerCase()) {
    try {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(USER_KEY, email);
    } catch {}
    return true;
  }
  return false;
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}