import { NextResponse } from "next/server";
import { SubscribersStore } from "@/lib/mock-data";
import { pickDefined } from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const subscriber = SubscribersStore.get(id);
  if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subscriber);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const patch = pickDefined({ email: body.email, name: body.name, status: body.status });
  const updated = SubscribersStore.update(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const removed = SubscribersStore.remove(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
