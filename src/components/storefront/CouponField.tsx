"use client";

import { useId, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { describeCoupon } from "@/lib/coupon-discount";

export function CouponField() {
  const { coupon, applyCoupon, removeCoupon, subtotal, discount } = useCart();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const inputId = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.ok) {
        applyCoupon(data.coupon);
        setCode("");
        setOpen(false);
      } else {
        setError(data.error ?? "קוד הקופון לא תקין");
      }
    } catch {
      setError("משהו השתבש, נסו שוב");
    } finally {
      setChecking(false);
    }
  };

  if (coupon) {
    return (
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-ink">
            קופון <span dir="ltr">{coupon.code}</span> ({describeCoupon(coupon)})
          </span>
          <button
            type="button"
            onClick={removeCoupon}
            className="text-ink-muted underline underline-offset-2 hover:text-green-700"
          >
            הסרה
          </button>
        </div>
        {discount === 0 && coupon.minOrder !== null && (
          <p className="text-xs text-ink-muted">ההנחה תחול בהזמנה מעל {coupon.minOrder} ₪.</p>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-sm text-ink-muted underline underline-offset-2 hover:text-green-700"
      >
        יש לך קוד קופון?
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-1.5 text-sm">
      <label htmlFor={inputId} className="text-ink-muted">
        קוד קופון
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="text"
          dir="ltr"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoComplete="off"
          autoCapitalize="none"
          className="flex-1 min-w-0 rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
        />
        <button
          type="submit"
          disabled={checking || !code.trim()}
          className="rounded-full bg-green-700 text-cream px-5 py-2 hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {checking ? "בודק..." : "החלה"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
