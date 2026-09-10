import { backendFetch, listQueryString, proxyListResponse, proxyResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, `/consultations${listQueryString(request)}`);
  return proxyListResponse(backendRes);
}

export async function POST(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/consultations", { method: "POST", body });
  return proxyResponse(backendRes);
}
