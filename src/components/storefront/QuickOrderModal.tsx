"use client";

import { useEffect, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useQuickOrder } from "@/lib/quick-order-context";
import { useCart } from "@/lib/cart-context";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { ADD_ONS } from "@/lib/add-ons";

export function QuickOrderModal() {
  const { product, close } = useQuickOrder();
  const { addItem, delivery, setDelivery, open: openCart } = useCart();

  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [localCity, setLocalCity] = useState(delivery.deliveryCity);
  const [localDate, setLocalDate] = useState(delivery.deliveryDate);
  const [localMessage, setLocalMessage] = useState(delivery.cardMessage);

  useEffect(() => {
    if (product) {
      setVariantId(product.variants[0]?.id ?? null);
      setQuantity(1);
      setSelectedAddOns([]);
      setLocalCity(delivery.deliveryCity);
      setLocalDate(delivery.deliveryDate);
      setLocalMessage(delivery.cardMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.productId]);

  if (!product) return null;

  const selectedVariant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const a = ADD_ONS.find((x) => x.id === id);
    return sum + (a?.price ?? 0);
  }, 0);
  const total = (selectedVariant.price + addOnsTotal) * quantity;

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleAdd = () => {
    setDelivery({ deliveryCity: localCity, deliveryDate: localDate, cardMessage: localMessage });
    addItem(
      {
        productId: product.productId,
        variantId: selectedVariant.id,
        name: product.name,
        variantLabel: selectedVariant.label,
        price: selectedVariant.price,
        image: product.image,
        addOns: selectedAddOns
          .map((id) => ADD_ONS.find((a) => a.id === id))
          .filter((a): a is NonNullable<typeof a> => Boolean(a)),
      },
      quantity
    );
    close();
    openCart();
  };

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 z-[60] bg-ink/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`הזמנה מהירה - ${product.name}`}
        className="fixed inset-x-0 bottom-0 sm:inset-0 z-[60] sm:flex sm:items-center sm:justify-center"
      >
        <div className="bg-cream rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="flex items-center justify-between px-5 h-16 border-b border-line sticky top-0 bg-cream">
            <h2 className="font-serif text-lg text-ink truncate">{product.name}</h2>
            <button
              type="button"
              onClick={close}
              aria-label="סגירה"
              className="shrink-0 text-ink hover:text-green-700"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-6">
            <PlaceholderImage src={product.image} alt={product.name} className="aspect-[16/9] rounded-2xl w-full" />

            {product.variants.length > 1 && (
              <div>
                <span className="text-sm text-ink-muted block mb-2">בחרו גודל</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={`rounded-full px-4 py-2 text-sm border transition-colors text-right ${
                        v.id === selectedVariant.id
                          ? "bg-green-700 text-cream border-green-700"
                          : "border-line text-ink-muted hover:border-green-700"
                      }`}
                    >
                      <span className="block">{v.label} · {v.price} ₪</span>
                      {v.servesLabel && (
                        <span className="block text-xs opacity-80">{v.servesLabel}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className="text-sm text-ink-muted">כמות</span>
              <div className="flex items-center gap-3 border border-line rounded-full px-3 py-1.5">
                <button
                  type="button"
                  aria-label="הפחת כמות"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-ink-muted hover:text-green-700"
                >
                  <Minus size={16} />
                </button>
                <span className="w-5 text-center">{quantity}</span>
                <button
                  type="button"
                  aria-label="הוסף כמות"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-ink-muted hover:text-green-700"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-ink-muted">עיר משלוח</span>
                <input
                  type="text"
                  value={localCity}
                  onChange={(e) => setLocalCity(e.target.value)}
                  className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-ink-muted">תאריך משלוח</span>
                <input
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-ink-muted">ברכה אישית (לא חובה)</span>
              <input
                type="text"
                value={localMessage}
                onChange={(e) => setLocalMessage(e.target.value)}
                className="rounded-xl border border-line px-4 py-2 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
              />
            </label>

            <div>
              <span className="text-sm text-ink-muted block mb-2">תוספות אפשריות</span>
              <div className="flex flex-col gap-2">
                {ADD_ONS.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between gap-2 border border-line rounded-xl px-4 py-2.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(a.id)}
                        onChange={() => toggleAddOn(a.id)}
                        className="accent-[var(--color-green-700)]"
                      />
                      {a.label}
                    </span>
                    <span className="text-sm text-ink-muted">+{a.price} ₪</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-cream border-t border-line px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-ink-muted block">סה&quot;כ</span>
              <span className="text-lg font-medium text-ink">{total} ₪</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors"
            >
              הוספה לסל
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
