import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

async function fetchTotal(path: string, cookieHeader: string): Promise<number> {
  const res = await fetch(`${BACKEND_URL}/api${path}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const json = await res.json();
  return json?.meta?.total ?? 0;
}

export default async function OverviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const cookieHeader = token ? `${AUTH_COOKIE_NAME}=${token}` : "";

  const [
    subscribersTotal,
    subscribersActive,
    blogCategoriesTotal,
    blogsTotal,
    blogsPublished,
    careersTotal,
    careersPending,
    contactTotal,
    contactNew,
    consultationsTotal,
    consultationsPending,
  ] = await Promise.all([
    fetchTotal("/subscribers?limit=1", cookieHeader),
    fetchTotal("/subscribers?limit=1&status=ACTIVE", cookieHeader),
    fetchTotal("/blog-categories?limit=1", cookieHeader),
    fetchTotal("/blogs?limit=1", cookieHeader),
    fetchTotal("/blogs?limit=1&status=PUBLISHED", cookieHeader),
    fetchTotal("/careers?limit=1", cookieHeader),
    fetchTotal("/careers?limit=1&status=PENDING", cookieHeader),
    fetchTotal("/contact?limit=1", cookieHeader),
    fetchTotal("/contact?limit=1&status=NEW", cookieHeader),
    fetchTotal("/consultations?limit=1", cookieHeader),
    fetchTotal("/consultations?limit=1&status=PENDING", cookieHeader),
  ]);

  const cards = [
    {
      label: "Subscribers",
      count: subscribersTotal,
      href: "/subscribers",
      hint: `${subscribersActive} active`,
    },
    {
      label: "Blog Categories",
      count: blogCategoriesTotal,
      href: "/blog-categories",
      hint: "categories",
    },
    {
      label: "Blogs & News",
      count: blogsTotal,
      href: "/blogs",
      hint: `${blogsPublished} published`,
    },
    {
      label: "Career Applications",
      count: careersTotal,
      href: "/careers",
      hint: `${careersPending} pending`,
    },
    {
      label: "Contact Messages",
      count: contactTotal,
      href: "/contact",
      hint: `${contactNew} new`,
    },
    {
      label: "Consultations",
      count: consultationsTotal,
      href: "/consultations",
      hint: `${consultationsPending} pending`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-muted">Snapshot of Aramway site content, live from AramwayBackend.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="overview-cards">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            data-testid={`overview-card-${card.href.slice(1)}`}
            className="rounded-lg border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-primary">{card.count}</p>
            <p className="mt-1 text-xs text-muted">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
