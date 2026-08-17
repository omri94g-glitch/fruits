import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export function EventsBusinessBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
      <PlaceholderImage className="aspect-[4/3] rounded-2xl w-full" />
      <div className="flex flex-col items-center md:items-start text-center md:text-right gap-4">
        <span className="text-xs tracking-[0.25em] text-gold uppercase">Events &amp; Business</span>
        <h2 className="font-serif text-2xl md:text-3xl text-ink">מגשים לאירועים ועסקים</h2>
        <p className="text-ink-muted max-w-md">
          מארחים כנס, אירוע משרדי או שמחה משפחתית? נבנה עבורכם מגש שמתאים בדיוק לכמות
          האורחים והאירוע שלכם.
        </p>
        <Link
          href="/products?occasion=אירועים ועסקים"
          className="rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
        >
          למגשים לאירועים
        </Link>
      </div>
    </section>
  );
}
