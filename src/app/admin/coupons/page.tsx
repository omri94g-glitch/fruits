import { db } from "@/lib/db";
import { CouponForm } from "@/components/admin/CouponForm";
import { CouponToggle } from "@/components/admin/CouponToggle";

function statusOf(c: { active: boolean; expiresAt: Date | null; maxUses: number | null; usedCount: number }) {
  if (!c.active) return { label: "כבוי", className: "bg-gray-100 text-gray-700" };
  if (c.expiresAt && c.expiresAt < new Date()) {
    return { label: "פג תוקף", className: "bg-red-100 text-red-700" };
  }
  if (c.maxUses !== null && c.usedCount >= c.maxUses) {
    return { label: "מומש במלואו", className: "bg-amber-100 text-amber-700" };
  }
  return { label: "פעיל", className: "bg-green-100 text-green-700" };
}

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif text-2xl text-ink">קופונים</h1>

      <CouponForm />

      {coupons.length === 0 ? (
        <p className="text-center text-ink-muted py-12">עדיין אין קופונים</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm text-right">
            <thead className="bg-cream-alt text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-medium">קוד</th>
                <th className="px-4 py-3 font-medium">הנחה</th>
                <th className="px-4 py-3 font-medium">שימושים</th>
                <th className="px-4 py-3 font-medium">תוקף עד</th>
                <th className="px-4 py-3 font-medium">מינימום הזמנה</th>
                <th className="px-4 py-3 font-medium">סטטוס</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const status = statusOf(c);
                return (
                  <tr key={c.id} className="border-t border-line hover:bg-cream-alt/50">
                    <td dir="ltr" className="px-4 py-3 text-right">
                      {c.code}
                    </td>
                    <td className="px-4 py-3">
                      {c.percentOff !== null ? `${c.percentOff}%` : `${Number(c.amountOff)} ₪`}
                    </td>
                    <td className="px-4 py-3">
                      {c.usedCount}
                      {c.maxUses !== null && ` / ${c.maxUses}`}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {c.expiresAt ? c.expiresAt.toLocaleDateString("he-IL") : "ללא"}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {c.minOrder !== null ? `${Number(c.minOrder)} ₪` : "ללא"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <CouponToggle id={c.id} active={c.active} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-ink-muted">
        ההנחה חלה על המוצרים בלבד, לא על דמי המשלוח. שימוש בקופון נספר רק אחרי שהתשלום אושר. כדי לשנות קופון
        קיים, כבה אותו וצור חדש.
      </p>
    </div>
  );
}
