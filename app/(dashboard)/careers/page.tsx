"use client";

import { FormEvent, useEffect, useState } from "react";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import { FormField, TextInput, Select } from "@/components/FormField";
import type { CareerApplication, CareerApplicationStatus } from "@/lib/mock-data";

interface CareerFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  expectedSalary: string;
  position: string;
  startDate: string;
}

const emptyForm: CareerFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  expectedSalary: "",
  position: "",
  startDate: "",
};

const STATUS_OPTIONS: CareerApplicationStatus[] = ["PENDING", "REVIEWED", "REJECTED", "HIRED"];

export default function CareersPage() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CareerFormState>(emptyForm);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState<CareerApplication | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  async function loadApplications() {
    setLoading(true);
    const res = await fetch("/api/careers");
    setApplications(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function openCreateModal() {
    setForm(emptyForm);
    setResumeFile(null);
    setCoverLetterFile(null);
    setFormError(null);
    setCreateOpen(true);
  }

  async function handleCreateSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!resumeFile || !coverLetterFile) {
      setFormError("Resume and cover letter files are required");
      return;
    }
    setSubmitting(true);
    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(form)) {
        body.append(key, value);
      }
      body.append("resume", resumeFile);
      body.append("coverLetter", coverLetterFile);

      const res = await fetch("/api/careers", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Something went wrong");
        return;
      }
      setCreateOpen(false);
      await loadApplications();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this application?")) return;
    await fetch(`/api/careers/${id}`, { method: "DELETE" });
    if (detail?.id === id) setDetail(null);
    await loadApplications();
  }

  async function handleStatusChange(id: string, status: CareerApplicationStatus) {
    setStatusSaving(true);
    try {
      const res = await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      if (res.ok) {
        setDetail(updated);
        setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      }
    } finally {
      setStatusSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Career Applications</h1>
          <p className="mt-1 text-sm text-muted">Applications submitted through the careers page.</p>
        </div>
        <Button onClick={openCreateModal} data-testid="new-career-btn">
          + New Application
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-left text-sm" data-testid="careers-table">
          <thead className="border-b border-border bg-cream-soft text-xs font-semibold uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Email</th>
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
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No applications yet.
                </td>
              </tr>
            )}
            {!loading &&
              applications.map((a) => (
                <tr key={a.id} data-testid={`row-${a.id}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {a.firstName} {a.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted">{a.position}</td>
                  <td className="px-4 py-3 text-muted">{a.email}</td>
                  <td className="px-4 py-3">
                    <Badge value={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDetail(a)} data-testid={`view-${a.id}`}>
                        View
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(a.id)} data-testid={`delete-${a.id}`}>
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
        title="New Application"
        onClose={() => setCreateOpen(false)}
        testId="career-create-modal"
      >
        <form onSubmit={handleCreateSubmit} data-testid="career-form">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" htmlFor="firstName" required>
              <TextInput
                id="firstName"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                data-testid="form-firstName"
              />
            </FormField>
            <FormField label="Last Name" htmlFor="lastName" required>
              <TextInput
                id="lastName"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                data-testid="form-lastName"
              />
            </FormField>
          </div>
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
          <FormField label="Phone" htmlFor="phone" required>
            <TextInput
              id="phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              data-testid="form-phone"
            />
          </FormField>
          <FormField label="Position" htmlFor="position" required>
            <TextInput
              id="position"
              required
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              data-testid="form-position"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="City" htmlFor="city" required>
              <TextInput
                id="city"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                data-testid="form-city"
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
          <FormField label="Address" htmlFor="address" required>
            <TextInput
              id="address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              data-testid="form-address"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Expected Salary" htmlFor="expectedSalary" required>
              <TextInput
                id="expectedSalary"
                required
                value={form.expectedSalary}
                onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                data-testid="form-expectedSalary"
              />
            </FormField>
            <FormField label="Start Date" htmlFor="startDate" required>
              <TextInput
                id="startDate"
                type="date"
                required
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                data-testid="form-startDate"
              />
            </FormField>
          </div>
          <FormField label="Resume" htmlFor="resume" required>
            <input
              id="resume"
              type="file"
              required
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
              data-testid="form-resume"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </FormField>
          <FormField label="Cover Letter" htmlFor="coverLetter" required>
            <input
              id="coverLetter"
              type="file"
              required
              onChange={(e) => setCoverLetterFile(e.target.files?.[0] ?? null)}
              data-testid="form-coverLetter"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
              {submitting ? "Saving..." : "Create Application"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={detail !== null}
        title={detail ? `${detail.firstName} ${detail.lastName}` : ""}
        onClose={() => setDetail(null)}
        testId="career-detail-modal"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted">Status</span>
              <Select
                value={detail.status}
                disabled={statusSaving}
                onChange={(e) => handleStatusChange(detail.id, e.target.value as CareerApplicationStatus)}
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
            <DetailRow label="Phone" value={detail.phone} />
            <DetailRow label="Position" value={detail.position} />
            <DetailRow label="Address" value={detail.address} />
            <DetailRow label="City" value={detail.city} />
            <DetailRow label="Country" value={detail.country} />
            <DetailRow label="Expected Salary" value={detail.expectedSalary} />
            <DetailRow label="Start Date" value={detail.startDate} />
            <DetailRow label="Resume" value={detail.resumeUrl} />
            <DetailRow label="Cover Letter" value={detail.coverLetterUrl} />
            <DetailRow label="Applied" value={new Date(detail.createdAt).toLocaleString()} />
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
