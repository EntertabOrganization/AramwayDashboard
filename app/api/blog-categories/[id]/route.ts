import { backendFetch, proxyResponse } from "@/lib/backend";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const backendRes = await backendFetch(request, `/blog-categories/${id}`);
  return proxyResponse(backendRes);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.text();
  const backendRes = await backendFetch(request, `/blog-categories/${id}`, { method: "PATCH", body });
  return proxyResponse(backendRes);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const backendRes = await backendFetch(request, `/blog-categories/${id}`, { method: "DELETE" });
  return proxyResponse(backendRes);
}
