import Link from "next/link";
import {
  SubscribersStore,
  BlogCategoriesStore,
  BlogsStore,
  CareerApplicationsStore,
  ContactMessagesStore,
  ConsultationsStore,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default function OverviewPage() {
  const cards = [
    {
      label: "Subscribers",
      count: SubscribersStore.list().length,
      href: "/subscribers",
      hint: `${SubscribersStore.list().filter((s) => s.status === "ACTIVE").length} active`,
    },
    {
      label: "Blog Categories",
      count: BlogCategoriesStore.list().length,
      href: "/blog-categories",
      hint: "categories",
    },
    {
      label: "Blogs & News",
      count: BlogsStore.list().length,
      href: "/blogs",
      hint: `${BlogsStore.list().filter((b) => b.status === "PUBLISHED").length} published`,
    },
    {
      label: "Career Applications",
      count: CareerApplicationsStore.list().length,
      href: "/careers",
      hint: `${CareerApplicationsStore.list().filter((c) => c.status === "PENDING").length} pending`,
    },
    {
      label: "Contact Messages",
      count: ContactMessagesStore.list().length,
      href: "/contact",
      hint: `${ContactMessagesStore.list().filter((c) => c.status === "NEW").length} new`,
    },
    {
      label: "Consultations",
      count: ConsultationsStore.list().length,
      href: "/consultations",
      hint: `${ConsultationsStore.list().filter((c) => c.status === "PENDING").length} pending`,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Snapshot of Aramway site content. All data below is in-memory mock data for this dashboard.
        </p>
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
