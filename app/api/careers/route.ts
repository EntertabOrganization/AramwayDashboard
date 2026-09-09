import { NextResponse } from "next/server";
import { CareerApplicationsStore } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(CareerApplicationsStore.list());
}

// This is a mock: it accepts plain JSON (including resumeUrl/coverLetterUrl
// as plain strings) rather than multipart file uploads.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const required = ["firstName", "lastName", "email", "phone", "position"];
  const missing = required.filter((field) => !body?.[field]);
  if (!body || missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
  }

  const application = CareerApplicationsStore.create({
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    address: body.address || "",
    city: body.city || "",
    country: body.country || "",
    expectedSalary: body.expectedSalary || "",
    position: body.position,
    startDate: body.startDate || "",
    resumeUrl: body.resumeUrl || "",
    coverLetterUrl: body.coverLetterUrl || "",
    status: body.status,
  });

  return NextResponse.json(application, { status: 201 });
}
