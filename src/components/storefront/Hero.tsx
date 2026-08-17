import Link from "next/link";
import { Check } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const trustItems = [
  "הכנה טרייה ביום המשלוח",
  "תשלום מאובטח",
  "שירות אישי",
  "משלוחים מהירים",
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 grid md:grid-cols-2 gap-10 items-center">
      <PlaceholderImage
        src="/images/tray-classic.png"
        alt="מגש פירות טריים"
        className="aspect-square md:aspect-[4/5] rounded-3xl order-2"
      />

      <div className="order-1 flex flex-col items-center md:items-start text-center md:text-right gap-5">
        <span className="text-xs tracking-[0.25em] text-gold uppercase">
          Premium Fruit Platters
        </span>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight text-ink">
          מגש פירות שהופך כל רגע לחגיגה
        </h1>
        <p className="text-ink-muted">פירות טריים, חיתוך מוקפד ומשלוח עד הדלת</p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
          <Link
            href="/products"
            className="rounded-full bg-green-700 text-cream px-8 py-3 text-sm text-center hover:bg-green-600 transition-colors"
          >
            לבחירת מגש
          </Link>
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-green-700 text-green-700 px-8 py-3 text-sm text-center hover:bg-green-700 hover:text-cream transition-colors"
          >
            הזמנה מהירה בוואטסאפ
          </a>
        </div>

        <ul className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 pt-2">
          {trustItems.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Check size={14} className="text-green-700 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
