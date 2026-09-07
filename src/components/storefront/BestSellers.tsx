import Link from "next/link";
import Image from "next/image";
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
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="text-center mb-10">
        <Image
          src="/images/best-sellers-heading-v2.png"
          alt="Best Sellers"
          width={1422}
          height={507}
          className="mx-auto w-full max-w-[280px] sm:max-w-[335px] md:max-w-[395px] h-auto"
        />
        <h2 className="font-serif text-3xl text-ink mt-2">המגשים שהלקוחות שלנו הכי אוהבים</h2>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-ink-muted">בקרוב יתווספו מגשים</p>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
            sm:mx-0 sm:px-0 sm:pb-0 sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="shrink-0 w-44 snap-start
                sm:w-[calc(33.333%-1rem)] lg:w-[calc(16.666%-1.25rem)]"
            >
              <ProductCard
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
            </div>
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
