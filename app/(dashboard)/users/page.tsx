"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { FormField, TextInput } from "@/components/FormField";
import type { Admin } from "@/lib/mock-data";

const emptyForm = { email: "", password: "", name: "" };

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadAdmins() {
    setLoading(true);
    const res = await fetch("/api/admins");
    const data = await res.json();
    setAdmins(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  function openCreateModal() {
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = { email: form.email, password: form.password, name: form.name || undefined };
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong");
        return;
      }
      setModalOpen(false);
      await loadAdmins();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Users</h1>
          <p className="mt-1 text-sm text-muted">People with login access to this dashboard.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-user-btn">
          + New User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="users-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && admins.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted">
                  No users yet.
                </td>
              </tr>
            )}
            {!loading &&
              admins.map((a) => (
                <tr key={a.id} data-testid={`row-${a.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{a.email}</td>
                  <td className="px-4 py-3 text-muted">{a.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{new Date(a.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="New User" onClose={() => setModalOpen(false)} testId="user-modal">
        <form onSubmit={handleSubmit} data-testid="user-form">
          <FormField label="Email" htmlFor="email" required>
            <TextInput
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-testid="form-email"
            />
          </FormField>
          <FormField label="Password" htmlFor="password" required>
            <TextInput
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              data-testid="form-password"
            />
          </FormField>
          <FormField label="Name" htmlFor="name">
            <TextInput
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="form-name"
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
              {submitting ? "Saving..." : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
