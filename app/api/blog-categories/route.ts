import { backendFetch, listQueryString, proxyListResponse, proxyResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, `/blog-categories${listQueryString(request)}`);
  return proxyListResponse(backendRes);
}

export async function POST(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/blog-categories", { method: "POST", body });
  return proxyResponse(backendRes);
}
