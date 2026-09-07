import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const trustItems = [
  "הכנה טרייה ביום המשלוח",
  "תשלום מאובטח",
  "שירות אישי",
  "משלוחים מהירים",
];

export function Hero() {
  return (
    <section className="relative">
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Image
          src="/images/hero-bg-mobile.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover sm:hidden"
        />
        <Image
          src="/images/cta-frame.png"
          alt=""
          fill
          sizes="100vw"
          className="hidden object-cover sm:block"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-12 flex flex-col items-center gap-8">
        <h1 className="sr-only">מגשי פירות מעוצבים לכל אירוע</h1>

        <Image
          src="/images/hero-banner-v2.png"
          alt="מגשי פירות מעוצבים לכל אירוע"
          width={1930}
          height={815}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="w-full h-auto"
        />

        <div className="flex flex-col items-center text-center gap-5 max-w-2xl">
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
              className="rounded-full border border-green-700 text-green-700 px-8 py-3 text-sm text-center hover:bg-green-700 hover:text-cream transition-colors"
            >
              הזמנה מהירה בוואטסאפ
            </a>
          </div>

          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <Leaf size={16} fill="currentColor" className="text-green-700 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
