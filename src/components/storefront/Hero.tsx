import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const trustItems = [
  "הכנה טרייה ביום המשלוח",
  "תשלום מאובטח",
  "שירות אישי",
  "משלוחים מהירים",
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-12 flex flex-col items-center gap-8">
      <h1 className="sr-only">מגש פירות שהופך כל רגע לחגיגה</h1>

      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="absolute -inset-6 -z-10 rounded-[2.5rem] opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 15% 20%, #F4A25F 0%, transparent 50%), radial-gradient(circle at 85% 25%, #C3543E 0%, transparent 45%), radial-gradient(circle at 50% 90%, #7A8F3D 0%, transparent 50%)",
          }}
        />
        <Image
          src="/images/hero-banner-full.png"
          alt="מגש פירות שהופך כל רגע לחגיגה - פירות טריים, חיתוך מוקפד ומשלוח עד הדלת"
          width={1536}
          height={1024}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="relative w-full h-auto rounded-3xl"
        />
      </div>

      <div className="flex flex-col items-center text-center gap-5 max-w-2xl">
        <div className="relative w-full">
          <Image
            src="/images/cta-frame.png"
            alt=""
            aria-hidden="true"
            width={1536}
            height={1024}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center px-[12%] py-[14%]">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                className="rounded-full border border-green-700 text-green-700 px-8 py-3 text-sm text-center hover:bg-green-700 hover:text-cream transition-colors bg-cream/70"
              >
                הזמנה מהירה בוואטסאפ
              </a>
            </div>
          </div>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
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
