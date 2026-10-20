// Pure discount math, shared by the browser (live totals) and the checkout
// API (the authoritative calculation). No database access here.

export type AppliedCoupon = {
  code: string;
  percentOff: number | null;
  amountOff: number | null;
  minOrder: number | null;
};

// Whole shekels only, like every price on the site: a percentage discount is
// rounded to the nearest shekel. Never more than the items total, so a
// coupon can't make the order negative (and never touches the delivery fee).
export function computeDiscount(coupon: AppliedCoupon, itemsTotal: number) {
  if (coupon.minOrder !== null && itemsTotal < coupon.minOrder) return 0;
  const raw =
    coupon.percentOff !== null
      ? Math.round((itemsTotal * coupon.percentOff) / 100)
      : (coupon.amountOff ?? 0);
  return Math.max(0, Math.min(raw, itemsTotal));
}

export function describeCoupon(coupon: AppliedCoupon) {
  return coupon.percentOff !== null
    ? `${coupon.percentOff}% הנחה`
    : `${coupon.amountOff} ₪ הנחה`;
}
