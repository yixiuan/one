import { cookies } from "next/headers";

const SALT = "nexshore_salt_2024";
const SESSION_COOKIE = "nexshore_admin_session";
const SESSION_SECRET = "nexshore_session_secret_change_in_production";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  return sha256Hex(`${password}:${SALT}`);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = `${username}:${Date.now()}`;
  const signature = await sha256Hex(`${payload}:${SESSION_SECRET}`);
  return btoa(`${payload}:${signature}`);
}

export async function verifySessionToken(
  token: string
): Promise<string | null> {
  try {
    const decoded = atob(token);
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [username, timestamp, signature] = parts;
    const expected = await sha256Hex(
      `${username}:${timestamp}:${SESSION_SECRET}`
    );
    if (expected !== signature) return null;
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 1000 * 60 * 60 * 24 * 7) return null;
    return username;
  } catch {
    return null;
  }
}

export async function getSessionCookie(): Promise<string | null> {
  const store = cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionCookie();
  if (!token) return false;
  const username = await verifySessionToken(token);
  return username !== null;
}

export async function getCurrentUsername(): Promise<string | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
