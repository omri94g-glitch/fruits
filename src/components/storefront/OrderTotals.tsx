"use client";

import { useCart } from "@/lib/cart-context";
import { CouponField } from "./CouponField";

export function OrderTotals() {
  const { subtotal, discount, deliveryFee, total } = useCart();

  return (
    <div className="flex flex-col gap-2 text-sm">
      <CouponField />
      <div className="flex items-center justify-between">
        <span className="text-ink-muted">מוצרים</span>
        <span className="text-ink">{subtotal} ₪</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-ink-muted">הנחה</span>
          <span className="text-ink">−{discount} ₪</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-ink-muted">משלוח</span>
        <span className="text-ink">
          {deliveryFee === null ? "יחושב לפי העיר" : `${deliveryFee} ₪`}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className="text-ink-muted">
          {deliveryFee === null ? 'סה"כ (לפני משלוח)' : 'סה"כ'}
        </span>
        <span className="text-xl font-medium text-ink">{total} ₪</span>
      </div>
    </div>
  );
}
