import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { AddToCartForm } from "@/components/storefront/AddToCartForm";

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
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 grid md:grid-cols-2 gap-12">
      <PlaceholderImage label={product.name} className="aspect-square rounded-3xl" />

      <div className="flex flex-col gap-5">
        <div>
          <span className="text-xs tracking-[0.25em] text-gold uppercase">{product.category}</span>
          <h1 className="font-serif text-3xl text-green-700 mt-2">{product.name}</h1>
        </div>
        <p className="text-ink/60 leading-relaxed">{product.description}</p>

        <AddToCartForm
          productId={product.id}
          productName={product.name}
          image={product.images[0] ?? ""}
          variants={variants}
        />
      </div>
    </div>
  );
}
