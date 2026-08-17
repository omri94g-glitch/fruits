"use client";

import Link from "next/link";
import Image from "next/image";
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
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="sr-only">לאיזה רגע אתם מזמינים?</h2>
      <Image
        src="/images/occasion-heading.png"
        alt=""
        width={1844}
        height={230}
        className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md h-auto mb-8"
      />

      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4
          sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {occasions.map((occasion) => (
          <Link
            key={occasion.label}
            href={`/products?occasion=${encodeURIComponent(occasion.label)}`}
            onClick={() => trackEvent("select_occasion", { occasion: occasion.label })}
            className="group flex flex-col gap-2 shrink-0 w-32 snap-start sm:w-auto"
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
