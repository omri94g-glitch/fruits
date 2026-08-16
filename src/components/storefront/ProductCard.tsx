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
    <div className="flex flex-col gap-3 group">
      <Link href={`/products/${slug}`} className="block">
        <PlaceholderImage className="aspect-square rounded-2xl w-full transition-transform group-hover:scale-[1.02]" />
      </Link>
      <div className="flex flex-col items-center text-center gap-1">
        <Link href={`/products/${slug}`} className="font-medium hover:text-green-700 transition-colors">
          {name}
        </Link>
        <span className="text-sm text-ink/60">החל מ-{fromPrice} ₪</span>
      </div>
      <Link
        href={`/products/${slug}`}
        className="mt-1 rounded-full bg-green-700 text-cream text-sm text-center py-2 hover:bg-green-600 transition-colors"
      >
        הזמנה
      </Link>
    </div>
  );
}
