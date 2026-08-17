import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function ProductCard({
  slug,
  name,
  fromPrice,
}: {
  slug: string;
  name: string;
  fromPrice: number;
}) {
  return (
    <div className="group flex flex-col gap-3">
      <Link href={`/products/${slug}`} className="relative block overflow-hidden rounded-2xl">
        <PlaceholderImage className="aspect-square w-full transition-transform duration-300 lg:group-hover:scale-105" />
        <span className="absolute inset-x-3 bottom-3 rounded-full bg-green-700 text-cream text-sm text-center py-2 shadow-sm transition-all duration-200 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
          הזמנה
        </span>
      </Link>

      <div className="flex flex-col items-center text-center gap-0.5">
        <Link
          href={`/products/${slug}`}
          className="font-medium text-ink hover:text-green-700 transition-colors"
        >
          {name}
        </Link>
        <span className="text-sm text-ink">החל מ-{fromPrice} ₪</span>
      </div>
    </div>
  );
}
