"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { FormField, TextInput, TextArea } from "@/components/FormField";
import type { BlogCategory } from "@/lib/mock-data";

const emptyForm = { name: "", slug: "", description: "" };

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/blog-categories");
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openCreateModal() {
    setEditing(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(category: BlogCategory) {
    setEditing(category);
    setForm({ name: category.name, slug: category.slug, description: category.description ?? "" });
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
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || undefined,
      };
      const res = await fetch(editing ? `/api/blog-categories/${editing.id}` : "/api/blog-categories", {
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
      await loadCategories();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) return;
    await fetch(`/api/blog-categories/${id}`, { method: "DELETE" });
    await loadCategories();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Blog Categories</h1>
          <p className="mt-1 text-sm text-muted">Categories used to organize blogs and news.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-category-btn">
          + New Category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="categories-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  No categories yet.
                </td>
              </tr>
            )}
            {!loading &&
              categories.map((c) => (
                <tr key={c.id} data-testid={`row-${c.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3 text-muted">{c.description ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => openEditModal(c)} data-testid={`edit-${c.id}`}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(c.id)} data-testid={`delete-${c.id}`}>
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
        title={editing ? "Edit Category" : "New Category"}
        onClose={() => setModalOpen(false)}
        testId="category-modal"
      >
        <form onSubmit={handleSubmit} data-testid="category-form">
          <FormField label="Name" htmlFor="name" required>
            <TextInput
              id="name"
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
              }}
              data-testid="form-name"
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
          <FormField label="Description" htmlFor="description">
            <TextArea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              data-testid="form-description"
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
              {submitting ? "Saving..." : editing ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
