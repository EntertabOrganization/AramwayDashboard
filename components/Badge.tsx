const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  UNSUBSCRIBED: "bg-gray-100 text-gray-700 border-gray-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  PUBLISHED: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  REVIEWED: "bg-blue-100 text-blue-800 border-blue-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  HIRED: "bg-green-100 text-green-800 border-green-200",
  NEW: "bg-blue-100 text-blue-800 border-blue-200",
  READ: "bg-gray-100 text-gray-700 border-gray-200",
  RESPONDED: "bg-green-100 text-green-800 border-green-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  BLOG: "bg-cream-deep text-secondary border-gold-light",
  NEWS: "bg-cream-deep text-secondary border-gold-light",
};

export default function Badge({ value }: { value: string }) {
  const styles = STATUS_STYLES[value] ?? "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span
      data-testid="badge"
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      {value}
    </span>
  );
}
