import { backendFetch, proxyListResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, "/availability");
  return proxyListResponse(backendRes);
}

export async function PUT(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/availability", { method: "PUT", body });
  return proxyListResponse(backendRes);
}
