"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { FormField, TextInput, TextArea, Select } from "@/components/FormField";
import type { Blog, BlogCategory, BlogStatus, BlogType } from "@/lib/mock-data";

interface BlogFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  type: BlogType;
  status: BlogStatus;
  tags: string;
  categoryId: string;
  authorName: string;
}

const emptyForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  type: "BLOG",
  status: "DRAFT",
  tags: "",
  categoryId: "",
  authorName: "",
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"" | BlogType>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  async function loadCategories() {
    const res = await fetch("/api/blog-categories");
    setCategories(await res.json());
  }

  async function loadBlogs(type: "" | BlogType = typeFilter) {
    setLoading(true);
    const query = type ? `?type=${type}` : "";
    const res = await fetch(`/api/blogs${query}`);
    setBlogs(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
    loadBlogs("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function categoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? "—";
  }

  function openCreateModal() {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" });
    setSlugTouched(false);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(blog: Blog) {
    setEditing(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage ?? "",
      type: blog.type,
      status: blog.status,
      tags: blog.tags.join(", "),
      categoryId: blog.categoryId,
      authorName: blog.authorName ?? "",
    });
    setSlugTouched(true);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        coverImage: form.coverImage || undefined,
        type: form.type,
        status: form.status,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        categoryId: form.categoryId,
        authorName: form.authorName || undefined,
      };
      const res = await fetch(editing ? `/api/blogs/${editing.id}` : "/api/blogs", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong");
        return;
      }
      setModalOpen(false);
      await loadBlogs();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this blog post?")) return;
    await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    await loadBlogs();
  }

  async function handleFilterChange(type: "" | BlogType) {
    setTypeFilter(type);
    await loadBlogs(type);
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Blogs</h1>
          <p className="mt-1 text-sm text-muted">Blog posts and news articles.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-blog-btn" disabled={categories.length === 0}>
          + New Blog
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium text-muted">Filter:</span>
        {(["", "BLOG", "NEWS"] as const).map((type) => (
          <button
            key={type || "ALL"}
            type="button"
            onClick={() => handleFilterChange(type)}
            data-testid={`filter-${type || "all"}`}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              typeFilter === type
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-muted hover:border-primary"
            }`}
          >
            {type || "All"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="blogs-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && blogs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No blog posts yet.
                </td>
              </tr>
            )}
            {!loading &&
              blogs.map((b) => (
                <tr key={b.id} data-testid={`row-${b.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{b.title}</td>
                  <td className="px-4 py-3 text-muted">{categoryName(b.categoryId)}</td>
                  <td className="px-4 py-3">
                    <Badge value={b.type} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge value={b.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{b.tags.join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => openEditModal(b)} data-testid={`edit-${b.id}`}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(b.id)} data-testid={`delete-${b.id}`}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Blog" : "New Blog"}
        onClose={() => setModalOpen(false)}
        testId="blog-modal"
      >
        <form onSubmit={handleSubmit} data-testid="blog-form">
          <FormField label="Title" htmlFor="title" required>
            <TextInput
              id="title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
              }}
              data-testid="form-title"
            />
          </FormField>
          <FormField label="Slug" htmlFor="slug" required>
            <TextInput
              id="slug"
              required
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm({ ...form, slug: e.target.value });
              }}
              data-testid="form-slug"
            />
          </FormField>
          <FormField label="Category" htmlFor="categoryId" required>
            <Select
              id="categoryId"
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              data-testid="form-category"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type" htmlFor="type">
              <Select
                id="type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as BlogType })}
                data-testid="form-type"
              >
                <option value="BLOG">BLOG</option>
                <option value="NEWS">NEWS</option>
              </Select>
            </FormField>
            <FormField label="Status" htmlFor="status">
              <Select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BlogStatus })}
                data-testid="form-status"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Excerpt" htmlFor="excerpt">
            <TextArea
              id="excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              data-testid="form-excerpt"
            />
          </FormField>
          <FormField label="Content" htmlFor="content">
            <TextArea
              id="content"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              data-testid="form-content"
            />
          </FormField>
          <FormField label="Cover Image URL" htmlFor="coverImage">
            <TextInput
              id="coverImage"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              data-testid="form-cover-image"
            />
          </FormField>
          <FormField label="Tags (comma separated)" htmlFor="tags">
            <TextInput
              id="tags"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              data-testid="form-tags"
              placeholder="strategy, growth"
            />
          </FormField>
          <FormField label="Author Name" htmlFor="authorName">
            <TextInput
              id="authorName"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              data-testid="form-author"
            />
          </FormField>
          {formError && (
            <p className="mb-3 text-sm font-medium text-red-600" data-testid="form-error">
              {formError}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} data-testid="form-submit">
              {submitting ? "Saving..." : editing ? "Save Changes" : "Create Blog"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
