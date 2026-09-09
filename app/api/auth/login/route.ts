import { NextResponse } from "next/server";
import { AUTH_COOKIE_MAX_AGE_SECONDS, AUTH_COOKIE_NAME, signJwt } from "@/lib/auth";

// Hardcoded admin credentials for this mock dashboard. There is no user
// database — this is intentionally a self-contained mock, not wired to
// AramwayBackend.
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin@1234";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, password } = body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signJwt({ sub: "admin", email: ADMIN_EMAIL });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  });
  return response;
}
