import { backendFetch, proxyResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, "/auth/me");
  return proxyResponse(backendRes);
}
