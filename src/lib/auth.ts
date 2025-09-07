// src/lib/auth.ts
const TOKEN_COOKIE = "xroll_at";
const TOKEN_TYPE = "Bearer";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30日（必要に応じて調整）

export function setAuthTokenCookie(token: string) {
  // セキュア寄りの属性（https運用前なら Secure は一時的に外してもOK）
  document.cookie = `${TOKEN_COOKIE}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function getAuthTokenFromCookie(): string | null {
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

export function clearAuthTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function buildAuthHeader(token?: string | null) {
  const t = token ?? getAuthTokenFromCookie();
  return t ? { Authorization: `${TOKEN_TYPE} ${t}` } : {};
}
