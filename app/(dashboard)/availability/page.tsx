"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import type { DayAvailability } from "@/lib/mock-data";
import { expandAllRanges, isValidRange, slotsToRanges, type TimeRange } from "@/lib/timeRanges";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface EditableRange extends TimeRange {
  id: string;
}

interface EditableDay {
  dayOfWeek: number;
  ranges: EditableRange[];
}

let rangeIdCounter = 0;
function newRangeId(): string {
  rangeIdCounter += 1;
  return `range-${rangeIdCounter}`;
}

function emptyWeek(): EditableDay[] {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({ dayOfWeek, ranges: [] }));
}

function toEditableWeek(days: DayAvailability[]): EditableDay[] {
  return days.map((day) => ({
    dayOfWeek: day.dayOfWeek,
    ranges: slotsToRanges(day.timeSlots).map((range) => ({ ...range, id: newRangeId() })),
  }));
}

export default function AvailabilityPage() {
  const [days, setDays] = useState<EditableDay[]>(emptyWeek());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/availability");
      const data: DayAvailability[] = await res.json();
      if (Array.isArray(data) && data.length === 7) setDays(toEditableWeek(data));
      setLoading(false);
    })();
  }, []);

  function addRange(dayOfWeek: number) {
    setSaved(false);
    setDays((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, ranges: [...day.ranges, { id: newRangeId(), start: "", end: "" }] }
          : day
      )
    );
  }

  function removeRange(dayOfWeek: number, id: string) {
    setSaved(false);
    setDays((prev) =>
      prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ranges: day.ranges.filter((r) => r.id !== id) } : day))
    );
  }

  function updateRange(dayOfWeek: number, id: string, field: "start" | "end", value: string) {
    setSaved(false);
    setDays((prev) =>
      prev.map((day) =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, ranges: day.ranges.map((r) => (r.id === id ? { ...r, [field]: value } : r)) }
          : day
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        days: days.map((day) => ({ dayOfWeek: day.dayOfWeek, timeSlots: expandAllRanges(day.ranges) })),
      };
      const res = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (Array.isArray(data) && data.length === 7) setDays(toEditableWeek(data));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Availability</h1>
          <p className="mt-1 text-sm text-muted">
            For each day, set one or more time ranges you&apos;re available (e.g. 9:00 AM–12:00 PM
            and 2:00 PM–5:00 PM). This is exactly what visitors see on Aramway&apos;s booking
            calendar — bookings are offered on the hour within each range.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading} data-testid="save-availability-btn">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <p className="mb-3 text-sm font-medium text-red-600" data-testid="form-error">
          {error}
        </p>
      )}
      {saved && !error && <p className="mb-3 text-sm font-medium text-primary">Availability saved.</p>}

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <div className="space-y-3" data-testid="availability-days">
          {days.map((day) => {
            const previewSlots = expandAllRanges(day.ranges);
            return (
              <div
                key={day.dayOfWeek}
                data-testid={`row-day-${day.dayOfWeek}`}
                className="rounded-lg border border-border bg-white p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-ink">{DAY_LABELS[day.dayOfWeek]}</span>
                  <button
                    type="button"
                    onClick={() => addRange(day.dayOfWeek)}
                    data-testid={`add-range-${day.dayOfWeek}`}
                    className="text-sm font-semibold text-primary hover:text-primary-dark"
                  >
                    + Add Time Range
                  </button>
                </div>

                {day.ranges.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">Unavailable</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {day.ranges.map((range) => (
                      <div key={range.id} className="flex flex-wrap items-center gap-2">
                        <input
                          type="time"
                          value={range.start}
                          onChange={(e) => updateRange(day.dayOfWeek, range.id, "start", e.target.value)}
                          data-testid={`range-start-${day.dayOfWeek}-${range.id}`}
                          className="rounded-md border border-border px-2 py-1.5 text-sm text-ink outline-none focus:border-primary"
                        />
                        <span className="text-sm text-muted">to</span>
                        <input
                          type="time"
                          value={range.end}
                          onChange={(e) => updateRange(day.dayOfWeek, range.id, "end", e.target.value)}
                          data-testid={`range-end-${day.dayOfWeek}-${range.id}`}
                          className="rounded-md border border-border px-2 py-1.5 text-sm text-ink outline-none focus:border-primary"
                        />
                        {(range.start || range.end) && !isValidRange(range) && (
                          <span className="text-xs font-medium text-red-600">End must be after start</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeRange(day.dayOfWeek, range.id)}
                          data-testid={`remove-range-${day.dayOfWeek}-${range.id}`}
                          className="text-sm text-muted hover:text-red-600"
                          aria-label="Remove time range"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {previewSlots.length > 0 && (
                  <p className="mt-3 text-xs text-muted">
                    Bookable times: <span className="text-ink">{previewSlots.join(", ")}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
