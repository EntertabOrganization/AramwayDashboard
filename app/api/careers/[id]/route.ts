import { NextResponse } from "next/server";
import { CareerApplicationsStore } from "@/lib/mock-data";
import { pickDefined } from "@/lib/api-utils";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const application = CareerApplicationsStore.get(id);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(application);
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const patch = pickDefined({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    city: body.city,
    country: body.country,
    expectedSalary: body.expectedSalary,
    position: body.position,
    startDate: body.startDate,
    resumeUrl: body.resumeUrl,
    coverLetterUrl: body.coverLetterUrl,
    status: body.status,
  });
  const updated = CareerApplicationsStore.update(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const removed = CareerApplicationsStore.remove(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
