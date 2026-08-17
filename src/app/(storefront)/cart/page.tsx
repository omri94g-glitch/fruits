"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

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

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-4 border border-line rounded-2xl p-4"
          >
            <PlaceholderImage className="w-20 h-20 rounded-xl shrink-0" />

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-ink-muted">{item.variantLabel}</p>
                </div>
                <button
                  type="button"
                  aria-label="הסרה מהעגלה"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="shrink-0 text-ink-muted hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 border border-line rounded-full px-2 py-1">
                  <button
                    type="button"
                    aria-label="הפחת כמות"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    className="text-ink-muted hover:text-green-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="הוסף כמות"
                    onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                    className="text-ink-muted hover:text-green-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="text-sm font-medium text-ink">{item.price * item.quantity} ₪</span>
              </div>
            </div>
          </div>
        ))}
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
