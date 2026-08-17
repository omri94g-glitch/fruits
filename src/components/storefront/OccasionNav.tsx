"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { trackEvent } from "@/lib/analytics";

const occasions = [
  { label: "יום הולדת", image: "/images/tray-classic.png" },
  { label: "אירוח ומשפחה", image: "/images/tray-table.png" },
  { label: "מתנה מרגשת", image: "/images/tray-classic.png" },
  { label: "בריאות ופינוק", image: "/images/tray-veggie.png" },
  { label: "אירועים ועסקים", image: "/images/tray-table.png" },
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
            key={occasion.label}
            href={`/products?occasion=${encodeURIComponent(occasion.label)}`}
            onClick={() => trackEvent("select_occasion", { occasion: occasion.label })}
            className="group flex flex-col gap-2"
          >
            <PlaceholderImage
              src={occasion.image}
              alt={occasion.label}
              className="aspect-square rounded-2xl w-full transition-transform group-hover:scale-[1.02]"
            />
            <span className="text-sm text-center font-medium text-ink group-hover:text-green-700 transition-colors">
              {occasion.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
