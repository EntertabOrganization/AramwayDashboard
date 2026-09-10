import { backendFetch, proxyResponse } from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.text();
  const backendRes = await backendFetch(request, "/auth/login", {
    method: "POST",
    body,
  });
  return proxyResponse(backendRes);
}
