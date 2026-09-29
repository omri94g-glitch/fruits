import Link from "next/link";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  deliveryDate: Date | null;
  createdAt: Date;
  customer: { name: string; phone: string };
  items: { nameSnapshot: string; quantity: number }[];
};

function itemsSummary(items: OrderRow["items"]) {
  if (items.length === 0) return "—";
  const [first, ...rest] = items;
  const firstLabel = `${first.nameSnapshot} × ${first.quantity}`;
  return rest.length === 0 ? firstLabel : `${firstLabel} ועוד ${rest.length}`;
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return <p className="text-center text-ink-muted py-12">לא נמצאו הזמנות</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full text-sm text-right">
        <thead className="bg-cream-alt text-ink-muted">
          <tr>
            <th className="px-4 py-3 font-medium">מס&apos; הזמנה</th>
            <th className="px-4 py-3 font-medium">לקוח</th>
            <th className="px-4 py-3 font-medium">מוצרים</th>
            <th className="px-4 py-3 font-medium">סטטוס</th>
            <th className="px-4 py-3 font-medium">סכום</th>
            <th className="px-4 py-3 font-medium">תאריך משלוח</th>
            <th className="px-4 py-3 font-medium">נוצרה</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-line hover:bg-cream-alt/50">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  dir="ltr"
                  className="text-green-700 hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div>{order.customer.name}</div>
                <div dir="ltr" className="text-xs text-ink-muted text-right">
                  {order.customer.phone}
                </div>
              </td>
              <td className="px-4 py-3 text-ink-muted">{itemsSummary(order.items)}</td>
              <td className="px-4 py-3">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-4 py-3">{order.totalAmount} ₪</td>
              <td className="px-4 py-3 text-ink-muted">
                {order.deliveryDate
                  ? new Date(order.deliveryDate).toLocaleDateString("he-IL")
                  : "—"}
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {new Date(order.createdAt).toLocaleDateString("he-IL")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
