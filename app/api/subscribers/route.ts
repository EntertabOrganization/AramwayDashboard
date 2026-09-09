import { NextResponse } from "next/server";
import { SubscribersStore } from "@/lib/mock-data";

// Auth for all non-auth API routes (this one included) is enforced centrally
// in middleware.ts, which verifies the `token` cookie before any request
// reaches here and returns 401 JSON if it's missing/invalid.

export async function GET() {
  return NextResponse.json(SubscribersStore.list());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.email !== "string" || !body.email.trim()) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const subscriber = SubscribersStore.create({
    email: body.email.trim(),
    name: body.name || undefined,
    status: body.status === "UNSUBSCRIBED" ? "UNSUBSCRIBED" : "ACTIVE",
  });

  return NextResponse.json(subscriber, { status: 201 });
}
