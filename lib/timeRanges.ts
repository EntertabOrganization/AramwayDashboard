/**
 * Availability is authored as time ranges ("9:00 to 12:00, and 2:00 to
 * 5:00") but stored/served as a flat list of hourly, on-the-hour bookable
 * slots ("09:00 AM", "10:00 AM", ...) — that's the shape AramwayBackend's
 * AvailabilityRule.timeSlots and the Aramway booking calendar already
 * expect, so no API changes were needed to support ranges here.
 */

export interface TimeRange {
  /** 24-hour "HH:MM", matching <input type="time">'s value format. */
  start: string;
  /** 24-hour "HH:MM", exclusive. */
  end: string;
}

function parse24HourToMinutes(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(wrapped / 60);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:00 ${period}`;
}

function minutesTo24Hour(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`;
}

function labelToMinutes(label: string): number | null {
  const match = label.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return null;
  let h = parseInt(match[1], 10) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return h * 60 + parseInt(match[2], 10);
}

/** True once both ends are filled in and end is strictly after start. */
export function isValidRange(range: TimeRange): boolean {
  if (!range.start || !range.end) return false;
  return parse24HourToMinutes(range.end) > parse24HourToMinutes(range.start);
}

/** Expands "09:30"-"12:00" into on-the-hour slots: 10:00 AM, 11:00 AM (rounds the start up to the next hour). */
export function expandRangeToSlots(range: TimeRange): string[] {
  if (!isValidRange(range)) return [];
  const startMin = parse24HourToMinutes(range.start);
  const endMin = parse24HourToMinutes(range.end);

  const slots: string[] = [];
  for (let cursor = Math.ceil(startMin / 60) * 60; cursor < endMin; cursor += 60) {
    slots.push(minutesToLabel(cursor));
  }
  return slots;
}

export function expandAllRanges(ranges: TimeRange[]): string[] {
  const slots = new Set<number>();
  for (const range of ranges) {
    for (const slot of expandRangeToSlots(range)) {
      const minutes = labelToMinutes(slot);
      if (minutes !== null) slots.add(minutes);
    }
  }
  return Array.from(slots)
    .sort((a, b) => a - b)
    .map(minutesToLabel);
}

/** Reconstructs displayable ranges from a saved flat slot list, merging back-to-back hours into one range. */
export function slotsToRanges(slots: string[]): TimeRange[] {
  const minutes = Array.from(new Set(slots.map(labelToMinutes).filter((m): m is number => m !== null))).sort(
    (a, b) => a - b
  );

  const ranges: { start: number; end: number }[] = [];
  for (const m of minutes) {
    const last = ranges[ranges.length - 1];
    if (last && last.end === m) {
      last.end = m + 60;
    } else {
      ranges.push({ start: m, end: m + 60 });
    }
  }
  return ranges.map((r) => ({ start: minutesTo24Hour(r.start), end: minutesTo24Hour(r.end) }));
}
