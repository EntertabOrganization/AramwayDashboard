import { backendFetch, listQueryString, proxyListResponse, proxyResponse } from "@/lib/backend";

// Auth for all non-auth API routes (this one included) is enforced centrally
// in middleware.ts, which verifies the `token` cookie before any request
// reaches here and returns 401 JSON if it's missing/invalid. Every call here
// then proxies to AramwayBackend, forwarding that same cookie.

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, `/subscribers${listQueryString(request)}`);
  return proxyListResponse(backendRes);
}

export async function POST(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/subscribers", { method: "POST", body });
  return proxyResponse(backendRes);
}
