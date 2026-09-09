import { NextResponse } from "next/server";
import { BlogsStore, type BlogType } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as BlogType | null;
  const categoryId = searchParams.get("categoryId");

  const blogs = BlogsStore.list({
    type: type === "BLOG" || type === "NEWS" ? type : undefined,
    categoryId: categoryId || undefined,
  });
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof body.categoryId !== "string" || !body.categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  const blog = BlogsStore.create({
    title: body.title.trim(),
    slug: (body.slug || body.title).trim().toLowerCase().replace(/\s+/g, "-"),
    excerpt: body.excerpt || "",
    content: body.content || "",
    coverImage: body.coverImage || undefined,
    type: body.type === "NEWS" ? "NEWS" : "BLOG",
    status: body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    tags: Array.isArray(body.tags) ? body.tags : [],
    categoryId: body.categoryId,
    authorName: body.authorName || undefined,
    publishedAt: body.status === "PUBLISHED" ? new Date().toISOString() : undefined,
  });

  return NextResponse.json(blog, { status: 201 });
}
