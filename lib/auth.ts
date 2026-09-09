import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me-aramway-dashboard-secret";

const secretKey = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "token";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: "admin";
  [key: string]: unknown;
}

/**
 * Signs a new JWT for the admin session. Works on both the Node.js and Edge
 * runtimes (jose, unlike jsonwebtoken, is Edge-compatible), which matters
 * because middleware.ts runs on the Edge runtime.
 */
export async function signJwt(payload: Omit<AdminSessionPayload, "role">): Promise<string> {
  return new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${AUTH_COOKIE_MAX_AGE_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verifies a JWT and returns its payload, or null if it is missing/invalid/expired.
 */
export async function verifyJwt(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}
