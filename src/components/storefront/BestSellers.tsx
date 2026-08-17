import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "./ProductCard";

export async function BestSellers() {
  const products = await db.product.findMany({
    where: { isBestSeller: true, isActive: true },
    orderBy: { createdAt: "asc" },
    take: 6,
    include: { variants: true },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-10">
        <span className="text-xs tracking-[0.25em] text-gold uppercase">Best Sellers</span>
        <h2 className="font-serif text-3xl text-ink mt-2">המגשים שהלקוחות שלנו הכי אוהבים</h2>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-ink-muted">בקרוב יתווספו מגשים</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              productId={p.id}
              slug={p.slug}
              name={p.name}
              description={p.description}
              fromPrice={Number(p.basePrice)}
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

      <div className="flex justify-center mt-10">
        <Link
          href="/products"
          className="rounded-full border border-green-700 text-green-700 px-8 py-2.5 text-sm hover:bg-green-700 hover:text-cream transition-colors"
        >
          צפו בכל המגשים
        </Link>
      </div>
    </section>
  );
}
