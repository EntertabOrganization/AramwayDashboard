import { NextResponse } from "next/server";
import { ConsultationsStore } from "@/lib/mock-data";
import { pickDefined } from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const consultation = ConsultationsStore.get(id);
  if (!consultation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(consultation);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const patch = pickDefined({
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
    country: body.country,
    service: body.service,
    notes: body.notes,
    date: body.date,
    time: body.time,
    status: body.status,
  });
  const updated = ConsultationsStore.update(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const removed = ConsultationsStore.remove(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
