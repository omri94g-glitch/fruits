import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="bg-green-900 py-14 text-center">
      <div className="mx-auto max-w-2xl px-4 flex flex-col items-center gap-4">
        <h2 className="font-serif text-2xl md:text-3xl text-cream">מוכנים להזמין?</h2>
        <p className="text-cream/70">
          בחרו מגש, בחרו גודל, וקבלו אותו טרי עד הדלת. מומלץ להזמין מראש לסופי שבוע
          ולחגים.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-gold text-green-900 px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          לבחירת מגש
        </Link>
      </div>
    </section>
  );
}
