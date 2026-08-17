"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

function addOnsKey(item: CartItem) {
  return item.addOns
    .map((a) => a.id)
    .sort()
    .join(",");
}

export function CartItemsList() {
  const { items, removeItem, updateQuantity } = useCart();

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const key = addOnsKey(item);
        const lineTotal =
          item.quantity * (item.price + item.addOns.reduce((sum, a) => sum + a.price, 0));

        return (
          <div
            key={`${item.productId}-${item.variantId}-${key}`}
            className="flex gap-4 border border-line rounded-2xl p-4"
          >
            <PlaceholderImage className="w-20 h-20 rounded-xl shrink-0" />

            <div className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-ink-muted">{item.variantLabel}</p>
                  {item.addOns.length > 0 && (
                    <p className="text-xs text-ink-muted">
                      {item.addOns.map((a) => a.label).join(", ")}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="הסרה מהעגלה"
                  onClick={() => removeItem(item.productId, item.variantId, key)}
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
                    onClick={() =>
                      updateQuantity(item.productId, item.variantId, key, item.quantity - 1)
                    }
                    className="text-ink-muted hover:text-green-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="הוסף כמות"
                    onClick={() =>
                      updateQuantity(item.productId, item.variantId, key, item.quantity + 1)
                    }
                    className="text-ink-muted hover:text-green-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="text-sm font-medium text-ink">{lineTotal} ₪</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
