"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { useQuickOrder, type QuickOrderVariant } from "@/lib/quick-order-context";
import { trackEvent } from "@/lib/analytics";

export function ProductCard({
  productId,
  slug,
  name,
  description,
  fromPrice,
  image,
  badges,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  description?: string;
  fromPrice: number;
  image?: string;
  badges?: string[];
  variants: QuickOrderVariant[];
}) {
  const { openWith } = useQuickOrder();
  const servesLabel = variants[0]?.servesLabel;

  const handleQuickOrder = () => {
    trackEvent("select_size_open", { product_id: productId, product_name: name });
    openWith({ productId, name, image: image ?? "", variants });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Link
          href={`/products/${slug}`}
          onClick={() => trackEvent("select_item", { product_id: productId, product_name: name })}
          className="block overflow-hidden rounded-2xl"
        >
          <PlaceholderImage className="aspect-square w-full" />
        </Link>
        {badges && badges.length > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-gold-soft text-ink text-xs px-3 py-1">
            {badges[0]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Link href={`/products/${slug}`} className="font-medium text-ink hover:text-green-700 transition-colors">
          {name}
        </Link>
        {description && <p className="text-xs text-ink-muted line-clamp-1">{description}</p>}
        {servesLabel && <p className="text-xs text-ink-muted">{servesLabel}</p>}
        <span className="text-sm font-medium text-ink">החל מ-{fromPrice} ₪</span>
      </div>

      <button
        type="button"
        onClick={handleQuickOrder}
        className="rounded-full bg-green-700 text-cream text-sm text-center py-2.5 hover:bg-green-600 transition-colors"
      >
        בחרו גודל והזמינו
      </button>
    </div>
  );
}
