import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AddToCartForm } from "@/components/storefront/AddToCartForm";
import { Reviews } from "@/components/storefront/Reviews";
import { FAQ } from "@/components/storefront/FAQ";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: { variants: true },
  });

  if (!product) notFound();

  const variants = product.variants.map((v) => ({
    id: v.id,
    label: v.label,
    price: Number(v.price),
    servesLabel: v.servesLabel,
  }));

  const fromPrice = Math.min(...variants.map((v) => v.price));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-3">
          <PlaceholderImage label={product.name} className="aspect-square rounded-3xl" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <PlaceholderImage key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs tracking-[0.25em] text-gold uppercase">{product.category}</span>
            <h1 className="font-serif text-3xl text-ink mt-2">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl font-medium text-ink">החל מ-{fromPrice} ₪</span>
              {variants[0]?.servesLabel && (
                <span className="text-sm text-ink-muted">{variants[0].servesLabel}</span>
              )}
            </div>
          </div>

          <p className="text-ink-muted leading-relaxed">{product.description}</p>

          <AddToCartForm
            productId={product.id}
            productName={product.name}
            image={product.images[0] ?? ""}
            variants={variants}
          />

          <div className="flex flex-col gap-4 border-t border-line pt-5 text-sm">
            {product.whatsIncluded.length > 0 && (
              <div>
                <span className="font-medium text-ink block mb-1.5">מה כלול במגש</span>
                <ul className="text-ink-muted flex flex-col gap-1">
                  {product.whatsIncluded.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.dimensions && (
              <div>
                <span className="font-medium text-ink">מידות: </span>
                <span className="text-ink-muted">{product.dimensions}</span>
              </div>
            )}

            {product.prepTimeHours && (
              <div>
                <span className="font-medium text-ink">זמן הכנה: </span>
                <span className="text-ink-muted">כ-{product.prepTimeHours} שעות מראש</span>
              </div>
            )}

            {product.storageInstructions && (
              <div>
                <span className="font-medium text-ink">שמירה: </span>
                <span className="text-ink-muted">{product.storageInstructions}</span>
              </div>
            )}

            {product.allergensInfo && (
              <div>
                <span className="font-medium text-ink">אלרגנים: </span>
                <span className="text-ink-muted">{product.allergensInfo}</span>
              </div>
            )}

            {product.kosherInfo && (
              <div>
                <span className="font-medium text-ink">כשרות: </span>
                <span className="text-ink-muted">{product.kosherInfo}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Reviews productId={product.id} />
      </div>
      <FAQ />
    </div>
  );
}
