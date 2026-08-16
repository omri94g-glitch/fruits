"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type Variant = { id: string; label: string; price: number };

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
  const { addItem } = useCart();
  const router = useRouter();

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {variants.length > 1 && (
        <div>
          <span className="text-sm text-ink/60 block mb-2">בחרו גודל</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                  v.id === variantId
                    ? "bg-green-700 text-cream border-green-700"
                    : "border-line text-ink/70 hover:border-green-700"
                }`}
              >
                {v.label} · {v.price} ₪
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm text-ink/60">כמות</span>
        <div className="flex items-center gap-3 border border-line rounded-full px-3 py-1.5">
          <button
            type="button"
            aria-label="הפחת כמות"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="text-ink/60 hover:text-green-700"
          >
            <Minus size={16} />
          </button>
          <span className="w-5 text-center">{quantity}</span>
          <button
            type="button"
            aria-label="הוסף כמות"
            onClick={() => setQuantity((q) => q + 1)}
            className="text-ink/60 hover:text-green-700"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors"
        >
          {added ? "נוסף לעגלה ✓" : "הוספה לעגלה"}
        </button>
        <button
          type="button"
          onClick={() => {
            handleAdd();
            router.push("/cart");
          }}
          className="flex-1 rounded-full border border-green-700 text-green-700 py-3 text-sm hover:bg-green-700 hover:text-cream transition-colors"
        >
          קנייה מיידית
        </button>
      </div>
    </div>
  );
}
