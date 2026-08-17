import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; occasion?: string }>;
}) {
  const { category, occasion } = await searchParams;

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(occasion ? { occasionTags: { has: occasion } } : {}),
      },
      orderBy: { createdAt: "asc" },
      include: { variants: true },
    }),
    db.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <div className="text-center mb-10">
        <span className="text-xs tracking-[0.25em] text-gold uppercase">Our Collection</span>
        <h1 className="font-serif text-3xl text-ink mt-2">כל המגשים</h1>
      </div>

      {occasion && (
        <div className="flex justify-center mb-6">
          <Link
            href={category ? `/products?category=${encodeURIComponent(category)}` : "/products"}
            className="inline-flex items-center gap-2 rounded-full bg-cream-alt px-4 py-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            מציגים עבור: {occasion} ✕
          </Link>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Link
          href="/products"
          className={`rounded-full px-5 py-1.5 text-sm border transition-colors ${
            !category
              ? "bg-green-700 text-cream border-green-700"
              : "border-line text-ink-muted hover:border-green-700"
          }`}
        >
          הכל
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/products?category=${encodeURIComponent(c.category)}`}
            className={`rounded-full px-5 py-1.5 text-sm border transition-colors ${
              category === c.category
                ? "bg-green-700 text-cream border-green-700"
                : "border-line text-ink-muted hover:border-green-700"
            }`}
          >
            {c.category}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-ink-muted">לא נמצאו מגשים בקטגוריה זו</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              slug={p.slug}
              name={p.name}
              description={p.description}
              fromPrice={Number(p.basePrice)}
              image={p.images[0]}
              badges={p.badges}
              variants={p.variants.map((v) => ({
                id: v.id,
                label: v.label,
                price: Number(v.price),
                servesLabel: v.servesLabel,
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
