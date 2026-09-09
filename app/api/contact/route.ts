import { NextResponse } from "next/server";
import { ContactMessagesStore } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(ContactMessagesStore.list());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || !body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }

  const message = ContactMessagesStore.create({
    name: body.name,
    email: body.email,
    phone: body.phone || undefined,
    service: body.service || undefined,
    program: body.program || undefined,
    message: body.message,
    status: body.status,
  });

  return NextResponse.json(message, { status: 201 });
}
