"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { trackEvent } from "@/lib/analytics";

const occasions = [
  "יום הולדת",
  "אירוח ומשפחה",
  "מתנה מרגשת",
  "בריאות ופינוק",
  "אירועים ועסקים",
];

export function OccasionNav() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="font-serif text-2xl md:text-3xl text-ink text-center mb-8">
        לאיזה רגע אתם מזמינים?
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {occasions.map((occasion) => (
          <Link
            key={occasion}
            href={`/products?occasion=${encodeURIComponent(occasion)}`}
            onClick={() => trackEvent("select_occasion", { occasion })}
            className="group flex flex-col gap-2"
          >
            <PlaceholderImage className="aspect-square rounded-2xl w-full transition-transform group-hover:scale-[1.02]" />
            <span className="text-sm text-center font-medium text-ink group-hover:text-green-700 transition-colors">
              {occasion}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
