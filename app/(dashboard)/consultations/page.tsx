"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { FormField, TextInput, TextArea, Select } from "@/components/FormField";
import type { Consultation, ConsultationStatus } from "@/lib/mock-data";

interface ConsultationFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  notes: string;
  date: string;
  time: string;
}

const emptyForm: ConsultationFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  notes: "",
  date: "",
  time: "",
};

const STATUS_OPTIONS: ConsultationStatus[] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ConsultationFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState<Consultation | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  async function loadConsultations() {
    setLoading(true);
    const res = await fetch("/api/consultations");
    setConsultations(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadConsultations();
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
        company: form.company || undefined,
        email: form.email,
        phone: form.phone,
        country: form.country,
        service: form.service || undefined,
        notes: form.notes || undefined,
        date: form.date,
        time: form.time,
      };
      const res = await fetch("/api/consultations", {
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
      await loadConsultations();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this consultation?")) return;
    await fetch(`/api/consultations/${id}`, { method: "DELETE" });
    if (detail?.id === id) setDetail(null);
    await loadConsultations();
  }

  async function handleStatusChange(id: string, status: ConsultationStatus) {
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      if (res.ok) {
        setDetail(updated);
        setConsultations((prev) => prev.map((c) => (c.id === id ? updated : c)));
      }
    } finally {
      setStatusSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Consultations</h1>
          <p className="mt-1 text-sm text-muted">Booked consultation sessions.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-consultation-btn">
          + New Consultation
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="consultations-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
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
            {!loading && consultations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No consultations yet.
                </td>
              </tr>
            )}
            {!loading &&
              consultations.map((c) => (
                <tr key={c.id} data-testid={`row-${c.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.company ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{new Date(c.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-muted">{c.time}</td>
                  <td className="px-4 py-3">
                    <Badge value={c.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDetail(c)} data-testid={`view-${c.id}`}>
                        View
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
        open={createOpen}
        title="New Consultation"
        onClose={() => setCreateOpen(false)}
        testId="consultation-create-modal"
      >
        <form onSubmit={handleCreateSubmit} data-testid="consultation-form">
          <FormField label="Name" htmlFor="name" required>
            <TextInput
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="form-name"
            />
          </FormField>
          <FormField label="Company" htmlFor="company">
            <TextInput
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              data-testid="form-company"
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
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Phone" htmlFor="phone" required>
              <TextInput
                id="phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="form-phone"
              />
            </FormField>
            <FormField label="Country" htmlFor="country" required>
              <TextInput
                id="country"
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                data-testid="form-country"
              />
            </FormField>
          </div>
          <FormField label="Service" htmlFor="service">
            <TextInput
              id="service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              data-testid="form-service"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" htmlFor="date" required>
              <TextInput
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                data-testid="form-date"
              />
            </FormField>
            <FormField label="Time" htmlFor="time" required>
              <TextInput
                id="time"
                type="time"
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                data-testid="form-time"
              />
            </FormField>
          </div>
          <FormField label="Notes" htmlFor="notes">
            <TextArea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              data-testid="form-notes"
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
              {submitting ? "Saving..." : "Create Consultation"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detail !== null}
        title={detail ? detail.name : ""}
        onClose={() => setDetail(null)}
        testId="consultation-detail-modal"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted">Status</span>
              <Select
                value={detail.status}
                disabled={statusSaving}
                onChange={(e) => handleStatusChange(detail.id, e.target.value as ConsultationStatus)}
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
            <DetailRow label="Company" value={detail.company ?? "—"} />
            <DetailRow label="Email" value={detail.email} />
            <DetailRow label="Phone" value={detail.phone} />
            <DetailRow label="Country" value={detail.country} />
            <DetailRow label="Service" value={detail.service ?? "—"} />
            <DetailRow label="Date" value={new Date(detail.date).toLocaleDateString()} />
            <DetailRow label="Time" value={detail.time} />
            {detail.notes && (
              <div className="border-b border-border pb-2">
                <span className="font-medium text-muted">Notes</span>
                <p className="mt-1 whitespace-pre-wrap text-ink">{detail.notes}</p>
              </div>
            )}
            <DetailRow label="Booked" value={new Date(detail.createdAt).toLocaleString()} />
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
