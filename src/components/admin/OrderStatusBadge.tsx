const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "חדשה", className: "bg-blue-100 text-blue-700" },
  CONFIRMED: { label: "אושרה", className: "bg-green-100 text-green-700" },
  PREPARING: { label: "בהכנה", className: "bg-amber-100 text-amber-700" },
  OUT_FOR_DELIVERY: { label: "בדרך ללקוח", className: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "נמסרה", className: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { label: "בוטלה", className: "bg-red-100 text-red-700" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export const ORDER_STATUSES = Object.entries(statusConfig).map(([value, { label }]) => ({
  value,
  label,
}));
