import { backendFetch, listQueryString, proxyListResponse, proxyResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, `/contact${listQueryString(request)}`);
  return proxyListResponse(backendRes);
}

export async function POST(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/contact", { method: "POST", body });
  return proxyResponse(backendRes);
}
