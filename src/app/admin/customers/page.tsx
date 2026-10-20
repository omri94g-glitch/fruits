import Link from "next/link";
import { db } from "@/lib/db";

// A customer counts as "regular" from this many paid orders. Business call -
// change the number here to move the line.
const REGULAR_MIN_ORDERS = 2;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const { filter, q } = await searchParams;
  const phoneQuery = q?.replace(/\D/g, "");

  const [customers, pendingCount] = await Promise.all([
    db.customer.findMany({
      where: {
        orders: { some: { paymentStatus: "PAID" } },
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                ...(phoneQuery ? [{ phone: { contains: phoneQuery } }] : []),
              ],
            }
          : {}),
      },
      include: {
        orders: { where: { paymentStatus: "PAID" }, select: { totalAmount: true, createdAt: true } },
      },
    }),
    db.order.count({ where: { paymentStatus: "PENDING", status: { not: "CANCELLED" } } }),
  ]);

  const all = customers
    .map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      email: c.email,
      marketingConsent: c.marketingConsent,
      orderCount: c.orders.length,
      totalSpent: c.orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
      lastOrderAt: c.orders.reduce(
        (latest, o) => (o.createdAt > latest ? o.createdAt : latest),
        c.orders[0].createdAt
      ),
    }))
    .sort((a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime());

  const regular = all.filter((c) => c.orderCount >= REGULAR_MIN_ORDERS);
  const consenting = all.filter((c) => c.marketingConsent);
  const rows = filter === "regular" ? regular : filter === "consent" ? consenting : all;

  const tabs = [
    { key: undefined, label: "הכל", count: all.length },
    { key: "regular", label: "לקוחות קבועים", count: regular.length },
    { key: "consent", label: "אישרו דיוור", count: consenting.length },
  ];
  const tabHref = (key?: string) => {
    const params = new URLSearchParams();
    if (key) params.set("filter", key);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/admin/customers?${qs}` : "/admin/customers";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-serif text-2xl text-ink">לקוחות</h1>
        <form method="GET" className="flex gap-2">
          {filter && <input type="hidden" name="filter" value={filter} />}
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
        {tabs.map((t) => {
          const active = filter === t.key || (!filter && !t.key);
          return (
            <Link
              key={t.label}
              href={tabHref(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                active
                  ? "bg-green-700 text-cream border-green-700"
                  : "border-line text-ink-muted hover:border-green-700"
              }`}
            >
              {t.label} ({t.count})
            </Link>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-ink-muted py-12">
          {all.length === 0 ? "עדיין אין לקוחות ששילמו" : "לא נמצאו לקוחות"}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm text-right">
            <thead className="bg-cream-alt text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">שם</th>
                <th className="px-4 py-3 font-medium">טלפון</th>
                <th className="px-4 py-3 font-medium">אימייל</th>
                <th className="px-4 py-3 font-medium">הזמנות</th>
                <th className="px-4 py-3 font-medium">סה&quot;כ רכישות</th>
                <th className="px-4 py-3 font-medium">הזמנה אחרונה</th>
                <th className="px-4 py-3 font-medium">דיוור</th>
                <th className="px-4 py-3 font-medium">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-t border-line hover:bg-cream-alt/50">
                  <td className="px-4 py-3">{c.name}</td>
                  <td dir="ltr" className="px-4 py-3 text-right">
                    {c.phone}
                  </td>
                  <td dir="ltr" className="px-4 py-3 text-right text-ink-muted">
                    {c.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">{c.orderCount}</td>
                  <td className="px-4 py-3">{c.totalSpent} ₪</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {c.lastOrderAt.toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-4 py-3">{c.marketingConsent ? "אישר" : "לא אישר"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        c.orderCount >= REGULAR_MIN_ORDERS
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.orderCount >= REGULAR_MIN_ORDERS ? "לקוח קבוע" : "לקוח חדש"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ink-muted">
        לקוח נכנס לרשימה אחרי שתשלום אושר בהזמנה שלו. לקוח קבוע הוא מי שבצע {REGULAR_MIN_ORDERS} הזמנות
        ששולמו ומעלה. שליחת הצעות והטבות מותרת רק ללקוחות שאישרו דיוור.
        {pendingCount > 0 &&
          ` יש ${pendingCount} הזמנות שעדיין לא אושר בהן תשלום, והן לא נספרות כאן.`}
      </p>
    </div>
  );
}
