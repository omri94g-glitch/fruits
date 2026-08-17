"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { CartItemsList } from "@/components/storefront/CartItemsList";

export default function CartPage() {
  const { items, subtotal, delivery, setDelivery } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl text-ink mb-4">העגלה שלכם ריקה</h1>
        <Link
          href="/products"
          className="inline-block rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
        >
          לצפייה במגשים
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-serif text-3xl text-ink mb-8 text-center">עגלת קניות</h1>

      <CartItemsList />

      <div className="flex flex-col gap-4 mt-6">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">עיר משלוח</span>
          <input
            type="text"
            value={delivery.deliveryCity}
            onChange={(e) => setDelivery({ deliveryCity: e.target.value })}
            className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">תאריך משלוח מבוקש</span>
          <input
            type="date"
            value={delivery.deliveryDate}
            onChange={(e) => setDelivery({ deliveryDate: e.target.value })}
            className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">ברכה אישית (לא חובה)</span>
          <input
            type="text"
            value={delivery.cardMessage}
            onChange={(e) => setDelivery({ cardMessage: e.target.value })}
            className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </label>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-line pt-6">
        <span className="text-ink-muted">סה&quot;כ</span>
        <span className="text-xl font-medium">{subtotal} ₪</span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors"
      >
        למעבר לתשלום
      </Link>
    </div>
  );
}
