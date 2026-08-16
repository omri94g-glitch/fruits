import Link from "next/link";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ORDER_STATUSES } from "@/components/admin/OrderStatusBadge";

function isOrderStatus(value: string): value is OrderStatus {
  return (Object.values(OrderStatus) as string[]).includes(value);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;

  const orders = await db.order.findMany({
    where: {
      ...(status && isOrderStatus(status) ? { status } : {}),
      ...(q
        ? {
            customer: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
              ],
            },
          }
        : {}),
    },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-serif text-2xl text-green-700">הזמנות</h1>
        <form method="GET" className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="חיפוש לפי שם או טלפון"
            className="rounded-full border border-line px-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={q ? `/admin?q=${encodeURIComponent(q)}` : "/admin"}
          className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
            !status
              ? "bg-green-700 text-cream border-green-700"
              : "border-line text-ink/60 hover:border-green-700"
          }`}
        >
          הכל
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/admin?status=${s.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
              status === s.value
                ? "bg-green-700 text-cream border-green-700"
                : "border-line text-ink/60 hover:border-green-700"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <OrdersTable
        orders={orders.map((o) => ({ ...o, totalAmount: Number(o.totalAmount) }))}
      />
    </div>
  );
}
