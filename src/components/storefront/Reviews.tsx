import Image from "next/image";
import { Star } from "lucide-react";
import { db } from "@/lib/db";

export async function Reviews({ productId }: { productId?: string } = {}) {
  const reviews = await db.review.findMany({
    where: { approved: true, ...(productId ? { productId } : {}) },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 text-center">
      <h2 className="sr-only">מה אומרים עלינו</h2>
      <Image
        src="/images/reviews-heading.png"
        alt="לקוחות מספרים - מה אומרים עלינו"
        width={1327}
        height={556}
        className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
      />

      {reviews.length === 0 ? (
        <p className="text-ink-muted mt-6 max-w-md mx-auto">
          אנחנו אוספים ביקורות מלקוחות - בקרוב יוצגו כאן חוות דעת אמיתיות מלקוחות שהזמינו.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-cream-alt rounded-2xl p-5 flex flex-col gap-2 text-right">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    fill={i < r.rating ? "currentColor" : "none"}
                    strokeWidth={i < r.rating ? 0 : 1.5}
                  />
                ))}
              </div>
              <p className="text-sm text-ink">&ldquo;{r.comment}&rdquo;</p>
              <span className="text-xs text-ink-muted">{r.authorName}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
