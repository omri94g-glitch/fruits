"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { trackEvent } from "@/lib/analytics";

type Variant = { id: string; label: string; price: number; servesLabel?: string | null };

export function AddToCartForm({
  productId,
  productName,
  image,
  variants,
}: {
  productId: string;
  productName: string;
  image: string;
  variants: Variant[];
}) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const { addItem, open: openCart } = useCart();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show once the form has scrolled up past the top of the
        // viewport - not before it's been reached on the way down.
        setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAdd = () => {
    if (!selected) return;
    addItem(
      {
        productId,
        variantId: selected.id,
        name: productName,
        variantLabel: selected.label,
        price: selected.price,
        image,
      },
      quantity
    );
    trackEvent("add_to_cart", {
      product_id: productId,
      product_name: productName,
      variant: selected.label,
      quantity,
      value: selected.price * quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddAndOpenCart = () => {
    handleAdd();
    openCart();
  };

  return (
    <div ref={sentinelRef} className="flex flex-col gap-6">
      {variants.length > 1 && (
        <div>
          <span className="text-sm text-ink-muted block mb-2">בחרו גודל</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors text-right ${
                  v.id === variantId
                    ? "bg-green-700 text-cream border-green-700"
                    : "border-line text-ink-muted hover:border-green-700"
                }`}
              >
                <span className="block">{v.label} · {v.price} ₪</span>
                {v.servesLabel && <span className="block text-xs opacity-80">{v.servesLabel}</span>}
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

      <button
        type="button"
        onClick={handleAddAndOpenCart}
        className="rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors"
      >
        {added ? "נוסף לעגלה ✓" : `הוספה לסל - ${selected.price * quantity} ₪`}
      </button>

      {showSticky && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-cream border-t border-line px-4 py-3 flex items-center gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          <span className="text-sm font-medium text-ink shrink-0">
            {selected.price * quantity} ₪
          </span>
          <button
            type="button"
            onClick={handleAddAndOpenCart}
            className="flex-1 rounded-full bg-green-700 text-cream py-2.5 text-sm hover:bg-green-600 transition-colors"
          >
            {added ? "נוסף לעגלה ✓" : "הוספה לסל"}
          </button>
        </div>
      )}
    </div>
  );
}
