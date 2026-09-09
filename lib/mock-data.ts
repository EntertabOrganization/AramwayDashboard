/**
 * In-memory mock "backend" for the Aramway admin dashboard.
 *
 * IMPORTANT: This is intentionally NOT a real database. All data lives in
 * module-level arrays and resets whenever the Next.js server restarts. That
 * is expected for this mock/demo dashboard, which is deliberately kept
 * decoupled from AramwayBackend (the real Express/Prisma/Postgres API being
 * built separately). Field shapes mirror the real backend's data model
 * exactly so a future integration is a drop-in swap of these helpers for
 * real HTTP calls.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Id generation
// ---------------------------------------------------------------------------

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const subscribers: Subscriber[] = [
  {
    id: generateId(),
    email: "sarah.johnson@northbridge.co",
    name: "Sarah Johnson",
    status: "ACTIVE",
    subscribedAt: "2025-11-02T09:15:00.000Z",
  },
  {
    id: generateId(),
    email: "michael.chen@vertexcapital.io",
    name: "Michael Chen",
    status: "ACTIVE",
    subscribedAt: "2025-12-14T14:32:00.000Z",
  },
  {
    id: generateId(),
    email: "priya.nair@statecraftgroup.com",
    name: "Priya Nair",
    status: "ACTIVE",
    subscribedAt: "2026-01-05T08:02:00.000Z",
  },
  {
    id: generateId(),
    email: "d.okafor@horizonpartners.biz",
    name: "David Okafor",
    status: "UNSUBSCRIBED",
    subscribedAt: "2025-08-19T11:45:00.000Z",
    unsubscribedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: generateId(),
    email: "elena.marquez@marquezlegal.com",
    name: "Elena Marquez",
    status: "ACTIVE",
    subscribedAt: "2026-02-20T16:10:00.000Z",
  },
  {
    id: generateId(),
    email: "tom.reilly@reillyandco.ie",
    status: "ACTIVE",
    subscribedAt: "2026-03-01T07:55:00.000Z",
  },
  {
    id: generateId(),
    email: "amina.hassan@sahelventures.africa",
    name: "Amina Hassan",
    status: "UNSUBSCRIBED",
    subscribedAt: "2025-06-10T12:00:00.000Z",
    unsubscribedAt: "2025-12-30T09:20:00.000Z",
  },
];

const blogCategories: BlogCategory[] = [
  {
    id: generateId(),
    name: "Business Strategy",
    slug: "business-strategy",
    description: "Insights on growth, positioning, and long-term strategic planning.",
    createdAt: "2025-05-01T09:00:00.000Z",
    updatedAt: "2025-05-01T09:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Company News",
    slug: "company-news",
    description: "Announcements and updates from Aramway.",
    createdAt: "2025-05-01T09:05:00.000Z",
    updatedAt: "2025-05-01T09:05:00.000Z",
  },
  {
    id: generateId(),
    name: "Market Insights",
    slug: "market-insights",
    description: "Analysis of market trends across the regions we operate in.",
    createdAt: "2025-06-12T10:00:00.000Z",
    updatedAt: "2025-06-12T10:00:00.000Z",
  },
];

const blogs: Blog[] = [
  {
    id: generateId(),
    title: "Five Pillars of a Resilient Growth Strategy",
    slug: "five-pillars-resilient-growth-strategy",
    excerpt: "How consultancies help mid-market firms build strategies that survive downturns.",
    content:
      "A resilient growth strategy rests on diversified revenue, disciplined cash management, adaptable operating models, strong governance, and a culture that treats change as routine rather than exceptional. In this article we break down each pillar with examples drawn from our client engagements over the last two years.",
    coverImage: "/mock/blog-growth-strategy.jpg",
    type: "BLOG",
    status: "PUBLISHED",
    tags: ["strategy", "growth", "resilience"],
    categoryId: blogCategories[0].id,
    authorName: "Layla Haddad",
    publishedAt: "2026-01-10T08:00:00.000Z",
    createdAt: "2026-01-05T08:00:00.000Z",
    updatedAt: "2026-01-10T08:00:00.000Z",
  },
  {
    id: generateId(),
    title: "Aramway Opens New Advisory Desk in Nairobi",
    slug: "aramway-opens-advisory-desk-nairobi",
    excerpt: "Expanding our East Africa presence to serve a fast-growing client base.",
    content:
      "We are pleased to announce the opening of a new advisory desk in Nairobi, staffed by a team of six consultants specializing in market entry and regulatory strategy. This expansion follows eighteen months of steady growth in engagements across East Africa.",
    coverImage: "/mock/news-nairobi-office.jpg",
    type: "NEWS",
    status: "PUBLISHED",
    tags: ["expansion", "east-africa", "announcement"],
    categoryId: blogCategories[1].id,
    authorName: "Aramway Editorial Team",
    publishedAt: "2026-02-03T09:30:00.000Z",
    createdAt: "2026-02-01T09:30:00.000Z",
    updatedAt: "2026-02-03T09:30:00.000Z",
  },
  {
    id: generateId(),
    title: "What Rising Interest Rates Mean for Mid-Market M&A",
    slug: "rising-interest-rates-mid-market-ma",
    excerpt: "A look at how financing conditions are reshaping deal structures in 2026.",
    content:
      "Deal volume in the mid-market has cooled but not stalled. Buyers are leaning more heavily on earn-outs and seller financing to bridge valuation gaps created by higher borrowing costs. We surveyed twenty of our active mandates to understand the shift.",
    type: "NEWS",
    status: "PUBLISHED",
    tags: ["m&a", "finance", "market-trends"],
    categoryId: blogCategories[2].id,
    authorName: "Marcus Webb",
    publishedAt: "2026-02-18T07:00:00.000Z",
    createdAt: "2026-02-15T07:00:00.000Z",
    updatedAt: "2026-02-18T07:00:00.000Z",
  },
  {
    id: generateId(),
    title: "Building a Governance Framework That Actually Gets Used",
    slug: "governance-framework-that-gets-used",
    excerpt: "Why most governance documents gather dust, and how to design ones that don't.",
    content:
      "Draft governance frameworks fail not because they are poorly written but because they are poorly adopted. This piece walks through a lightweight rollout process we use with clients: short workshops, a single-page decision log, and a 90-day review cadence.",
    coverImage: "/mock/blog-governance.jpg",
    type: "BLOG",
    status: "DRAFT",
    tags: ["governance", "operations"],
    categoryId: blogCategories[0].id,
    authorName: "Layla Haddad",
    createdAt: "2026-03-01T11:00:00.000Z",
    updatedAt: "2026-03-01T11:00:00.000Z",
  },
  {
    id: generateId(),
    title: "Talent Retention Playbook for Family-Owned Businesses",
    slug: "talent-retention-playbook-family-owned-businesses",
    excerpt: "Practical steps for keeping key non-family talent engaged through succession.",
    content:
      "Family-owned businesses face a distinct retention challenge during leadership transitions. We outline compensation structures, mentorship pairing, and communication practices that reduce key-employee attrition during succession windows.",
    type: "BLOG",
    status: "DRAFT",
    tags: ["talent", "succession", "family-business"],
    categoryId: blogCategories[0].id,
    createdAt: "2026-03-05T13:20:00.000Z",
    updatedAt: "2026-03-05T13:20:00.000Z",
  },
  {
    id: generateId(),
    title: "Aramway Named to Regional Top Consultancies List",
    slug: "aramway-named-regional-top-consultancies-list",
    excerpt: "Recognition for our client work across strategy and operations mandates.",
    content:
      "We're honored to be included in this year's regional ranking of top advisory firms, a recognition we credit entirely to the trust our clients place in our teams. Read the full announcement and methodology notes.",
    type: "NEWS",
    status: "PUBLISHED",
    tags: ["award", "announcement"],
    categoryId: blogCategories[1].id,
    authorName: "Aramway Editorial Team",
    publishedAt: "2026-03-08T10:00:00.000Z",
    createdAt: "2026-03-06T10:00:00.000Z",
    updatedAt: "2026-03-08T10:00:00.000Z",
  },
];

const careerApplications: CareerApplication[] = [
  {
    id: generateId(),
    firstName: "Grace",
    lastName: "Kimani",
    email: "grace.kimani@example.com",
    phone: "+254-711-223344",
    address: "14 Riverside Drive",
    city: "Nairobi",
    country: "Kenya",
    expectedSalary: "USD 4,500 / month",
    position: "Senior Strategy Consultant",
    startDate: "2026-05-01",
    resumeUrl: "https://mock-files.aramway.test/resumes/grace-kimani.pdf",
    coverLetterUrl: "https://mock-files.aramway.test/cover-letters/grace-kimani.pdf",
    status: "PENDING",
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: generateId(),
    firstName: "Omar",
    lastName: "Farouk",
    email: "omar.farouk@example.com",
    phone: "+20-100-555-1122",
    address: "22 Tahrir Square",
    city: "Cairo",
    country: "Egypt",
    expectedSalary: "USD 3,200 / month",
    position: "Financial Analyst",
    startDate: "2026-04-15",
    resumeUrl: "https://mock-files.aramway.test/resumes/omar-farouk.pdf",
    coverLetterUrl: "https://mock-files.aramway.test/cover-letters/omar-farouk.pdf",
    status: "REVIEWED",
    createdAt: "2026-02-20T09:30:00.000Z",
    updatedAt: "2026-02-27T15:00:00.000Z",
  },
  {
    id: generateId(),
    firstName: "Isabelle",
    lastName: "Laurent",
    email: "isabelle.laurent@example.com",
    phone: "+33-6-12-34-56-78",
    address: "8 Rue de Rivoli",
    city: "Paris",
    country: "France",
    expectedSalary: "EUR 5,000 / month",
    position: "Marketing Manager",
    startDate: "2026-06-01",
    resumeUrl: "https://mock-files.aramway.test/resumes/isabelle-laurent.pdf",
    coverLetterUrl: "https://mock-files.aramway.test/cover-letters/isabelle-laurent.pdf",
    status: "HIRED",
    createdAt: "2026-01-15T11:00:00.000Z",
    updatedAt: "2026-02-10T09:00:00.000Z",
  },
  {
    id: generateId(),
    firstName: "Ravi",
    lastName: "Shankar",
    email: "ravi.shankar@example.com",
    phone: "+91-98765-43210",
    address: "45 MG Road",
    city: "Bengaluru",
    country: "India",
    expectedSalary: "USD 2,800 / month",
    position: "Junior Business Analyst",
    startDate: "2026-05-20",
    resumeUrl: "https://mock-files.aramway.test/resumes/ravi-shankar.pdf",
    coverLetterUrl: "https://mock-files.aramway.test/cover-letters/ravi-shankar.pdf",
    status: "REJECTED",
    createdAt: "2026-02-05T08:45:00.000Z",
    updatedAt: "2026-02-12T10:15:00.000Z",
  },
  {
    id: generateId(),
    firstName: "Chloe",
    lastName: "Bennett",
    email: "chloe.bennett@example.com",
    phone: "+44-7700-900123",
    address: "10 Baker Street",
    city: "London",
    country: "United Kingdom",
    expectedSalary: "GBP 4,200 / month",
    position: "HR Business Partner",
    startDate: "2026-04-28",
    resumeUrl: "https://mock-files.aramway.test/resumes/chloe-bennett.pdf",
    coverLetterUrl: "https://mock-files.aramway.test/cover-letters/chloe-bennett.pdf",
    status: "PENDING",
    createdAt: "2026-03-04T13:00:00.000Z",
    updatedAt: "2026-03-04T13:00:00.000Z",
  },
];

const contactMessages: ContactMessage[] = [
  {
    id: generateId(),
    name: "Henry Osei",
    email: "henry.osei@example.com",
    phone: "+233-24-555-0101",
    service: "Business Strategy Advisory",
    message: "We're a manufacturing SME in Accra looking for help defining a 3-year growth plan. Could someone reach out to schedule an intro call?",
    status: "NEW",
    createdAt: "2026-03-07T09:12:00.000Z",
    updatedAt: "2026-03-07T09:12:00.000Z",
  },
  {
    id: generateId(),
    name: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+81-90-1234-5678",
    service: "Market Entry Consulting",
    message: "Interested in your market entry services for expanding our retail brand into Southeast Asia. What's the typical engagement timeline?",
    status: "READ",
    createdAt: "2026-03-02T14:20:00.000Z",
    updatedAt: "2026-03-03T08:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Carla Mendez",
    email: "carla.mendez@example.com",
    program: "Executive Leadership Program",
    message: "Can you send more details about enrollment dates and pricing for the next cohort of the Executive Leadership Program?",
    status: "RESPONDED",
    createdAt: "2026-02-25T10:00:00.000Z",
    updatedAt: "2026-02-26T09:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Nadia Petrova",
    email: "nadia.petrova@example.com",
    phone: "+7-916-555-0199",
    service: "Financial Restructuring",
    message: "Our board is evaluating restructuring options and we'd like a confidential consultation. Please advise on next steps.",
    status: "NEW",
    createdAt: "2026-03-08T16:45:00.000Z",
    updatedAt: "2026-03-08T16:45:00.000Z",
  },
];

const consultations: Consultation[] = [
  {
    id: generateId(),
    name: "Robert Kim",
    company: "Kim Textiles Ltd.",
    email: "robert.kim@kimtextiles.com",
    phone: "+82-10-2222-3333",
    country: "South Korea",
    service: "Operations Optimization",
    notes: "Wants to discuss reducing lead times across two factories.",
    date: "2026-03-15",
    time: "10:00",
    status: "CONFIRMED",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-02T11:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Fatima Zahra",
    company: "Zahra Holdings",
    email: "fatima.zahra@zahraholdings.ma",
    phone: "+212-661-234567",
    country: "Morocco",
    service: "Business Strategy Advisory",
    notes: "Follow-up session after initial strategy workshop.",
    date: "2026-03-20",
    time: "14:30",
    status: "PENDING",
    createdAt: "2026-03-05T12:00:00.000Z",
    updatedAt: "2026-03-05T12:00:00.000Z",
  },
  {
    id: generateId(),
    name: "James O'Sullivan",
    email: "james.osullivan@example.com",
    phone: "+353-87-123-4567",
    country: "Ireland",
    service: "Market Entry Consulting",
    date: "2026-02-28",
    time: "09:00",
    status: "COMPLETED",
    createdAt: "2026-02-10T08:00:00.000Z",
    updatedAt: "2026-02-28T10:00:00.000Z",
  },
  {
    id: generateId(),
    name: "Ana Beatriz Costa",
    company: "Costa & Partners",
    email: "ana.costa@costapartners.com.br",
    phone: "+55-11-98888-7777",
    country: "Brazil",
    service: "Financial Restructuring",
    notes: "Requested a reschedule; original slot conflicted with board meeting.",
    date: "2026-03-10",
    time: "16:00",
    status: "CANCELLED",
    createdAt: "2026-02-22T13:30:00.000Z",
    updatedAt: "2026-03-04T09:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Generic CRUD helper factory
// ---------------------------------------------------------------------------

function createCrud<T extends { id: string }>(store: T[]) {
  return {
    list(): T[] {
      return [...store];
    },
    get(id: string): T | undefined {
      return store.find((item) => item.id === id);
    },
    create(data: Omit<T, "id">): T {
      const item = { ...data, id: generateId() } as T;
      store.push(item);
      return item;
    },
    update(id: string, data: Partial<Omit<T, "id">>): T | undefined {
      const index = store.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      store[index] = { ...store[index], ...data };
      return store[index];
    },
    remove(id: string): boolean {
      const index = store.findIndex((item) => item.id === id);
      if (index === -1) return false;
      store.splice(index, 1);
      return true;
    },
  };
}

// ---------------------------------------------------------------------------
// Public resource APIs
// ---------------------------------------------------------------------------

const subscriberCrud = createCrud(subscribers);
export const SubscribersStore = {
  list: subscriberCrud.list,
  get: subscriberCrud.get,
  remove: subscriberCrud.remove,
  create(data: Omit<Subscriber, "id" | "subscribedAt"> & { subscribedAt?: string }): Subscriber {
    return subscriberCrud.create({
      ...data,
      status: data.status ?? "ACTIVE",
      subscribedAt: data.subscribedAt ?? nowIso(),
    });
  },
  update(id: string, data: Partial<Omit<Subscriber, "id">>): Subscriber | undefined {
    // Auto-manage unsubscribedAt when status flips.
    const patch = { ...data };
    if (patch.status === "UNSUBSCRIBED" && !patch.unsubscribedAt) {
      patch.unsubscribedAt = nowIso();
    }
    if (patch.status === "ACTIVE") {
      patch.unsubscribedAt = undefined;
    }
    return subscriberCrud.update(id, patch);
  },
};

const blogCategoryCrud = createCrud(blogCategories);
export const BlogCategoriesStore = {
  list: blogCategoryCrud.list,
  get: blogCategoryCrud.get,
  remove: blogCategoryCrud.remove,
  create(data: Omit<BlogCategory, "id" | "createdAt" | "updatedAt">): BlogCategory {
    const ts = nowIso();
    return blogCategoryCrud.create({ ...data, createdAt: ts, updatedAt: ts });
  },
  update(id: string, data: Partial<Omit<BlogCategory, "id" | "createdAt">>): BlogCategory | undefined {
    return blogCategoryCrud.update(id, { ...data, updatedAt: nowIso() });
  },
};

const blogCrud = createCrud(blogs);
export const BlogsStore = {
  list(filters?: { type?: BlogType; categoryId?: string }): Blog[] {
    let result = blogCrud.list();
    if (filters?.type) {
      result = result.filter((b) => b.type === filters.type);
    }
    if (filters?.categoryId) {
      result = result.filter((b) => b.categoryId === filters.categoryId);
    }
    return result;
  },
  get: blogCrud.get,
  remove: blogCrud.remove,
  create(data: Omit<Blog, "id" | "createdAt" | "updatedAt">): Blog {
    const ts = nowIso();
    return blogCrud.create({ ...data, createdAt: ts, updatedAt: ts });
  },
  update(id: string, data: Partial<Omit<Blog, "id" | "createdAt">>): Blog | undefined {
    const patch = { ...data, updatedAt: nowIso() };
    if (patch.status === "PUBLISHED" && !patch.publishedAt) {
      const existing = blogCrud.get(id);
      if (!existing?.publishedAt) {
        patch.publishedAt = nowIso();
      }
    }
    return blogCrud.update(id, patch);
  },
};

const careerCrud = createCrud(careerApplications);
export const CareerApplicationsStore = {
  list: careerCrud.list,
  get: careerCrud.get,
  remove: careerCrud.remove,
  create(data: Omit<CareerApplication, "id" | "createdAt" | "updatedAt" | "status"> & { status?: CareerApplicationStatus }): CareerApplication {
    const ts = nowIso();
    return careerCrud.create({ ...data, status: data.status ?? "PENDING", createdAt: ts, updatedAt: ts });
  },
  update(id: string, data: Partial<Omit<CareerApplication, "id" | "createdAt">>): CareerApplication | undefined {
    return careerCrud.update(id, { ...data, updatedAt: nowIso() });
  },
};

const contactCrud = createCrud(contactMessages);
export const ContactMessagesStore = {
  list: contactCrud.list,
  get: contactCrud.get,
  remove: contactCrud.remove,
  create(data: Omit<ContactMessage, "id" | "createdAt" | "updatedAt" | "status"> & { status?: ContactMessageStatus }): ContactMessage {
    const ts = nowIso();
    return contactCrud.create({ ...data, status: data.status ?? "NEW", createdAt: ts, updatedAt: ts });
  },
  update(id: string, data: Partial<Omit<ContactMessage, "id" | "createdAt">>): ContactMessage | undefined {
    return contactCrud.update(id, { ...data, updatedAt: nowIso() });
  },
};

const consultationCrud = createCrud(consultations);
export const ConsultationsStore = {
  list: consultationCrud.list,
  get: consultationCrud.get,
  remove: consultationCrud.remove,
  create(data: Omit<Consultation, "id" | "createdAt" | "updatedAt" | "status"> & { status?: ConsultationStatus }): Consultation {
    const ts = nowIso();
    return consultationCrud.create({ ...data, status: data.status ?? "PENDING", createdAt: ts, updatedAt: ts });
  },
  update(id: string, data: Partial<Omit<Consultation, "id" | "createdAt">>): Consultation | undefined {
    return consultationCrud.update(id, { ...data, updatedAt: nowIso() });
  },
};
