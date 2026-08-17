"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { CartItemsList } from "./CartItemsList";
import { trackEvent } from "@/lib/analytics";

export function CartDrawer() {
  const { items, subtotal, delivery, setDelivery, isOpen, close } = useCart();

  useEffect(() => {
    if (isOpen) trackEvent("view_cart", { value: subtotal, items: items.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="עגלת קניות"
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-cream shadow-xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-line shrink-0">
          <h2 className="font-serif text-xl text-ink">עגלת קניות</h2>
          <button
            type="button"
            onClick={close}
            aria-label="סגירת עגלה"
            className="text-ink hover:text-green-700"
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-ink-muted">העגלה שלכם ריקה</p>
            <Link
              href="/products"
              onClick={close}
              className="rounded-full bg-green-700 text-cream px-6 py-2.5 text-sm hover:bg-green-600 transition-colors"
            >
              לצפייה במגשים
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <CartItemsList />

              <div className="flex flex-col gap-4 mt-6">
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-ink-muted">עיר משלוח</span>
                  <input
                    type="text"
                    value={delivery.deliveryCity}
                    onChange={(e) => setDelivery({ deliveryCity: e.target.value })}
                    className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-ink-muted">תאריך משלוח מבוקש</span>
                  <input
                    type="date"
                    value={delivery.deliveryDate}
                    onChange={(e) => setDelivery({ deliveryDate: e.target.value })}
                    className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm">
                  <span className="text-ink-muted">ברכה אישית (לא חובה)</span>
                  <input
                    type="text"
                    value={delivery.cardMessage}
                    onChange={(e) => setDelivery({ cardMessage: e.target.value })}
                    className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
                  />
                </label>
              </div>
            </div>

            <div className="shrink-0 border-t border-line px-5 py-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">סה&quot;כ</span>
                <span className="text-xl font-medium text-ink">{subtotal} ₪</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="block text-center rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors"
              >
                מעבר לתשלום
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
