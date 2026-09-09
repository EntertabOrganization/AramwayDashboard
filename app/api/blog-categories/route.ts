import { NextResponse } from "next/server";
import { BlogCategoriesStore } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(BlogCategoriesStore.list());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (typeof body.slug !== "string" || !body.slug.trim()) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const category = BlogCategoriesStore.create({
    name: body.name.trim(),
    slug: body.slug.trim(),
    description: body.description || undefined,
  });

  return NextResponse.json(category, { status: 201 });
}
