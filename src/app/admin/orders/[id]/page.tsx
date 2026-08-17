import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <Link href="/admin" className="text-sm text-ink-muted hover:text-green-700">
          ← חזרה להזמנות
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
          <h1 dir="ltr" className="font-serif text-2xl text-ink text-right">
            {order.orderNumber}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <section className="grid sm:grid-cols-2 gap-6">
        <div className="bg-cream-alt rounded-2xl p-5 flex flex-col gap-1.5 text-sm">
          <h2 className="font-medium mb-1">פרטי לקוח</h2>
          <span>{order.customer.name}</span>
          <span dir="ltr" className="text-right">{order.customer.phone}</span>
          {order.customer.email && (
            <span dir="ltr" className="text-right">
              {order.customer.email}
            </span>
          )}
        </div>

        <div className="bg-cream-alt rounded-2xl p-5 flex flex-col gap-1.5 text-sm">
          <h2 className="font-medium mb-1">פרטי משלוח</h2>
          <span>
            {order.deliveryCity}, {order.deliveryAddress}
          </span>
          {order.deliveryDate && (
            <span>תאריך: {new Date(order.deliveryDate).toLocaleDateString("he-IL")}</span>
          )}
          {order.deliveryTimeSlot && <span>שעה: {order.deliveryTimeSlot}</span>}
          {order.cardMessage && <span>הקדשה: {order.cardMessage}</span>}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-sm">פריטים</h2>
        <div className="rounded-2xl border border-line overflow-hidden">
          {order.items.map((item) => {
            const addOns = Array.isArray(item.addOns)
              ? (item.addOns as { id: string; label: string; price: number }[])
              : [];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-3 text-sm border-b border-line last:border-b-0"
              >
                <div>
                  <span>
                    {item.nameSnapshot} × {item.quantity}
                  </span>
                  {addOns.length > 0 && (
                    <div className="text-xs text-ink-muted mt-1">
                      תוספות: {addOns.map((a) => a.label).join(", ")}
                    </div>
                  )}
                </div>
                <span>{Number(item.unitPrice) * item.quantity} ₪</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between px-4 py-3 text-sm bg-cream-alt font-medium">
            <span>סה&quot;כ</span>
            <span>{Number(order.totalAmount)} ₪</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-sm">תשלום</h2>
        <p className="text-sm text-ink">
          סטטוס תשלום: {order.paymentStatus}
          {order.paymentProvider && ` · ${order.paymentProvider}`}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-sm">עדכון סטטוס</h2>
        <StatusUpdateForm orderId={order.id} currentStatus={order.status} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-sm">היסטוריית סטטוסים</h2>
        <div className="flex flex-col gap-2 text-sm text-ink-muted">
          {order.statusHistory.map((h) => (
            <div key={h.id} className="flex items-center justify-between">
              <span>{h.status}</span>
              <span>
                {new Date(h.changedAt).toLocaleString("he-IL")} · {h.changedBy}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
