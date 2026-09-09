"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { FormField, TextInput, TextArea, Select } from "@/components/FormField";
import type { ContactMessage, ContactMessageStatus } from "@/lib/mock-data";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  program: string;
  message: string;
}

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  program: "",
  message: "",
};

const STATUS_OPTIONS: ContactMessageStatus[] = ["NEW", "READ", "RESPONDED"];

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ContactFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState<ContactMessage | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  async function loadMessages() {
    setLoading(true);
    const res = await fetch("/api/contact");
    setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  function openCreateModal() {
    setForm(emptyForm);
    setFormError(null);
    setCreateOpen(true);
  }

  async function handleCreateSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        service: form.service || undefined,
        program: form.program || undefined,
        message: form.message,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong");
        return;
      }
      setCreateOpen(false);
      await loadMessages();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (detail?.id === id) setDetail(null);
    await loadMessages();
  }

  async function handleStatusChange(id: string, status: ContactMessageStatus) {
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      if (res.ok) {
        setDetail(updated);
        setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
    } finally {
      setStatusSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Contact Messages</h1>
          <p className="mt-1 text-sm text-muted">Messages submitted through the contact form.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-contact-btn">
          + New Message
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="contact-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Service / Program</th>
              <th className="px-4 py-3">Status</th>
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
            {!loading && messages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No messages yet.
                </td>
              </tr>
            )}
            {!loading &&
              messages.map((m) => (
                <tr key={m.id} data-testid={`row-${m.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{m.name}</td>
                  <td className="px-4 py-3 text-muted">{m.email}</td>
                  <td className="px-4 py-3 text-muted">{m.service ?? m.program ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge value={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDetail(m)} data-testid={`view-${m.id}`}>
                        View
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(m.id)} data-testid={`delete-${m.id}`}>
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
        open={createOpen}
        title="New Contact Message"
        onClose={() => setCreateOpen(false)}
        testId="contact-create-modal"
      >
        <form onSubmit={handleCreateSubmit} data-testid="contact-form">
          <FormField label="Name" htmlFor="name" required>
            <TextInput
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="form-name"
            />
          </FormField>
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
          <FormField label="Phone" htmlFor="phone">
            <TextInput
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              data-testid="form-phone"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Service" htmlFor="service">
              <TextInput
                id="service"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                data-testid="form-service"
              />
            </FormField>
            <FormField label="Program" htmlFor="program">
              <TextInput
                id="program"
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                data-testid="form-program"
              />
            </FormField>
          </div>
          <FormField label="Message" htmlFor="message" required>
            <TextArea
              id="message"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              data-testid="form-message"
            />
          </FormField>
          {formError && (
            <p className="mb-3 text-sm font-medium text-red-600" data-testid="form-error">
              {formError}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} data-testid="form-submit">
              {submitting ? "Saving..." : "Create Message"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detail !== null}
        title={detail ? detail.name : ""}
        onClose={() => setDetail(null)}
        testId="contact-detail-modal"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted">Status</span>
              <Select
                value={detail.status}
                disabled={statusSaving}
                onChange={(e) => handleStatusChange(detail.id, e.target.value as ContactMessageStatus)}
                data-testid="detail-status-select"
                className="w-40"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <DetailRow label="Email" value={detail.email} />
            <DetailRow label="Phone" value={detail.phone ?? "—"} />
            <DetailRow label="Service" value={detail.service ?? "—"} />
            <DetailRow label="Program" value={detail.program ?? "—"} />
            <div className="border-b border-border pb-2">
              <span className="font-medium text-muted">Message</span>
              <p className="mt-1 whitespace-pre-wrap text-ink">{detail.message}</p>
            </div>
            <DetailRow label="Received" value={new Date(detail.createdAt).toLocaleString()} />
          </div>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2 last:border-0">
      <span className="font-medium text-muted">{label}</span>
      <span className="text-right text-ink break-all">{value || "—"}</span>
    </div>
  );
}
