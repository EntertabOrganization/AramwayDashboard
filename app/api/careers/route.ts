import { backendFetch, listQueryString, proxyListResponse, proxyResponse } from "@/lib/backend";

export async function GET(request: Request) {
  const backendRes = await backendFetch(request, `/careers${listQueryString(request)}`);
  return proxyListResponse(backendRes);
}

// The real backend's create endpoint is public (used by the marketing site's
// application form) and requires multipart/form-data with actual resume +
// cover letter files, so the admin "New Application" form builds a FormData
// with real File objects and we forward it as-is.
export async function POST(request: Request) {
  const formData = await request.formData();
  const backendRes = await backendFetch(request, "/careers", { method: "POST", body: formData });
  return proxyResponse(backendRes);
}
