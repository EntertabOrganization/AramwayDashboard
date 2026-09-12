/**
 * Shared TypeScript types for the Aramway admin dashboard's resources.
 *
 * These mirror AramwayBackend's Prisma schema exactly. This file used to
 * also hold an in-memory mock store standing in for the real backend; now
 * that app/api/** proxies to AramwayBackend (see lib/backend.ts), only the
 * type definitions remain, kept here so existing imports don't need to
 * change.
 */

export type SubscriberStatus = "ACTIVE" | "UNSUBSCRIBED";

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: SubscriberStatus;
  subscribedAt: string;
  unsubscribedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlogType = "BLOG" | "NEWS";
export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  type: BlogType;
  status: BlogStatus;
  tags: string[];
  categoryId: string;
  authorName?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CareerApplicationStatus = "PENDING" | "REVIEWED" | "REJECTED" | "HIRED";

export interface CareerApplication {
  id: string;
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
  resumeUrl: string;
  coverLetterUrl: string;
  status: CareerApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContactMessageStatus = "NEW" | "READ" | "RESPONDED";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  program?: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export type ConsultationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Consultation {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  country: string;
  service?: string;
  notes?: string;
  date: string;
  time: string;
  meetLink: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

/** One row per day of week (0 = Sunday .. 6 = Saturday); empty timeSlots means unavailable that day. */
export interface DayAvailability {
  dayOfWeek: number;
  timeSlots: string[];
}
