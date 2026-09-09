import { NextResponse } from "next/server";
import { ConsultationsStore } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(ConsultationsStore.list());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.name || !body.email || !body.phone || !body.country || !body.date || !body.time) {
    return NextResponse.json(
      { error: "name, email, phone, country, date and time are required" },
      { status: 400 }
    );
  }

  const consultation = ConsultationsStore.create({
    name: body.name,
    company: body.company || undefined,
    email: body.email,
    phone: body.phone,
    country: body.country,
    service: body.service || undefined,
    notes: body.notes || undefined,
    date: body.date,
    time: body.time,
    status: body.status,
  });

  return NextResponse.json(consultation, { status: 201 });
}
