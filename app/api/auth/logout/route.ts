import { backendFetch, proxyResponse } from "@/lib/backend";

export async function POST(request: Request) {
  const backendRes = await backendFetch(request, "/auth/logout", { method: "POST" });
  return proxyResponse(backendRes);
}
