"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { FormField, TextInput, Select } from "@/components/FormField";
import type { Subscriber, SubscriberStatus } from "@/lib/mock-data";

const emptyForm = { email: "", name: "", status: "ACTIVE" as SubscriberStatus };

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadSubscribers() {
    setLoading(true);
    const res = await fetch("/api/subscribers");
    const data = await res.json();
    setSubscribers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadSubscribers();
  }, []);

  function openCreateModal() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(subscriber: Subscriber) {
    setEditing(subscriber);
    setForm({ email: subscriber.email, name: subscriber.name ?? "", status: subscriber.status });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = { email: form.email, name: form.name || undefined, status: form.status };
      const res = await fetch(editing ? `/api/subscribers/${editing.id}` : "/api/subscribers", {
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
      await loadSubscribers();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this subscriber?")) return;
    await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    await loadSubscribers();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Subscribers</h1>
          <p className="mt-1 text-sm text-muted">Newsletter subscribers for the Aramway site.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-subscriber-btn">
          + New Subscriber
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="subscribers-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Subscribed At</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No subscribers yet.
                </td>
              </tr>
            )}
            {!loading &&
              subscribers.map((s) => (
                <tr key={s.id} data-testid={`row-${s.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{s.email}</td>
                  <td className="px-4 py-3 text-muted">{s.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge value={s.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openEditModal(s)}
                        data-testid={`edit-${s.id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(s.id)}
                        data-testid={`delete-${s.id}`}
                      >
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
        title={editing ? "Edit Subscriber" : "New Subscriber"}
        onClose={() => setModalOpen(false)}
        testId="subscriber-modal"
      >
        <form onSubmit={handleSubmit} data-testid="subscriber-form">
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
          <FormField label="Name" htmlFor="name">
            <TextInput
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="form-name"
            />
          </FormField>
          <FormField label="Status" htmlFor="status">
            <Select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as SubscriberStatus })}
              data-testid="form-status"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="UNSUBSCRIBED">UNSUBSCRIBED</option>
            </Select>
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
              {submitting ? "Saving..." : editing ? "Save Changes" : "Create Subscriber"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
