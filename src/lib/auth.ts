export const DEFAULT_USERNAME: string | undefined = import.meta.env.VITE_DEFAULT_USERNAME;
export const DEFAULT_PASSWORD: string | undefined = import.meta.env.VITE_DEFAULT_PASSWORD;

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
  // Guard: require env-provided credentials
  if (!DEFAULT_USERNAME || !DEFAULT_PASSWORD) {
    console.warn(
      "Login blocked: missing VITE_DEFAULT_USERNAME or VITE_DEFAULT_PASSWORD in environment."
    );
    return false;
  }
  if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
    try {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(USER_KEY, username);
    } catch {}
    return true;
  }
  return false;
}

// Note: Email-based login removed per requirements; only username/password are supported.

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
}