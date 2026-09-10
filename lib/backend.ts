import { NextResponse } from "next/server";

/**
 * Thin proxy layer to AramwayBackend (the real Express/Prisma API). Every
 * app/api/** route handler forwards here instead of touching in-memory mock
 * data, so the dashboard's own API contract (flat arrays on GET, etc.) stays
 * unchanged for the page components while the real backend does the work.
 */
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

/**
 * The dashboard's list pages render every row with no client-side pagination
 * UI, so requests that don't specify `limit` get a generously high one
 * instead of the backend's default of 20 — otherwise rows beyond the first
 * page would silently disappear from the table.
 */
export function listQueryString(request: Request, defaultLimit = 1000): string {
  const url = new URL(request.url);
  if (!url.searchParams.has("limit")) {
    url.searchParams.set("limit", String(defaultLimit));
  }
  return `?${url.searchParams.toString()}`;
}

/** Calls `${BACKEND_URL}/api${path}`, forwarding the incoming request's cookies. */
export function backendFetch(request: Request, path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  if (init.body && typeof init.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return fetch(`${BACKEND_URL}/api${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

/** Turns a backend Response into a NextResponse, forwarding status/body/Set-Cookie. */
export async function proxyResponse(backendRes: Response): Promise<NextResponse> {
  const body = await backendRes.json().catch(() => null);
  const res = NextResponse.json(body, { status: backendRes.status });
  const setCookie = backendRes.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);
  return res;
}

/** Same as proxyResponse, but unwraps `{ data, meta }` down to just `data` for list endpoints. */
export async function proxyListResponse(backendRes: Response): Promise<NextResponse> {
  const body = await backendRes.json().catch(() => null);
  if (!backendRes.ok) return NextResponse.json(body, { status: backendRes.status });
  return NextResponse.json(body?.data ?? []);
}
