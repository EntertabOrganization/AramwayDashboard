import { NextResponse } from "next/server";
import { ContactMessagesStore } from "@/lib/mock-data";
import { pickDefined } from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const message = ContactMessagesStore.get(id);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(message);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const patch = pickDefined({
    name: body.name,
    email: body.email,
    phone: body.phone,
    service: body.service,
    program: body.program,
    message: body.message,
    status: body.status,
  });
  const updated = ContactMessagesStore.update(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const removed = ContactMessagesStore.remove(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
