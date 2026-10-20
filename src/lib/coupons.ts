import { db } from "@/lib/db";
import { computeDiscount, type AppliedCoupon } from "@/lib/coupon-discount";

export function normalizeCouponCode(input: string) {
  return input.replace(/\s+/g, "").toLowerCase();
}

export type CouponCheck =
  | { ok: true; coupon: AppliedCoupon; discount: number }
  | { ok: false; error: string };

// Server-side check used both by the live "apply code" box and, again, by
// checkout - the client's idea of the discount is never trusted.
export async function findUsableCoupon(rawCode: string, itemsTotal: number): Promise<CouponCheck> {
  const code = normalizeCouponCode(rawCode);
  if (!code) return { ok: false, error: "נא להזין קוד קופון" };

  const row = await db.coupon.findUnique({ where: { code } });
  // Same message for unknown and disabled so codes can't be probed for existence.
  if (!row || !row.active) return { ok: false, error: "קוד הקופון לא תקין" };
  if (row.expiresAt && row.expiresAt < new Date()) {
    return { ok: false, error: "תוקף הקופון פג" };
  }
  if (row.maxUses !== null && row.usedCount >= row.maxUses) {
    return { ok: false, error: "הקופון מומש במלואו" };
  }

  const coupon: AppliedCoupon = {
    code: row.code,
    percentOff: row.percentOff,
    amountOff: row.amountOff === null ? null : Number(row.amountOff),
    minOrder: row.minOrder === null ? null : Number(row.minOrder),
  };
  if (coupon.minOrder !== null && itemsTotal < coupon.minOrder) {
    return { ok: false, error: `הקופון תקף להזמנה מעל ${coupon.minOrder} ₪` };
  }

  return { ok: true, coupon, discount: computeDiscount(coupon, itemsTotal) };
}

// Called from the payment webhooks, once, when an order first becomes PAID.
export async function recordCouponUse(code: string | null) {
  if (!code) return;
  await db.coupon.updateMany({ where: { code }, data: { usedCount: { increment: 1 } } });
}
