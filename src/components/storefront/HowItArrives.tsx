import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const shots = [
  { caption: "המגש המלא", src: "/images/arrival-1-tray.png" },
  { caption: "האריזה", src: "/images/arrival-3-packaging.png" },
  { caption: "הברכה", src: "/images/arrival-2-card.png" },
  { caption: "מסירת המשלוח", src: "/images/arrival-4-delivery.png" },
  { caption: "המגש על שולחן אירוח", src: "/images/arrival-5-table.png" },
];

export function HowItArrives() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 text-center">
      <h2 className="sr-only">ככה זה מגיע אליכם</h2>
      <Image
        src="/images/see-real-thing-heading-v2.png"
        alt="See The Real Thing"
        width={1500}
        height={277}
        className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
      />
      <p className="text-ink-muted mt-2 max-w-xl mx-auto">
        כך נראית הזמנה טיפוסית שלנו - מהמגש ועד שהוא מגיע אליכם.
      </p>

      <div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 mt-8
          sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {shots.map(({ caption, src }) => (
          <div key={caption} className="flex flex-col gap-2 shrink-0 w-32 snap-start sm:w-auto">
            <PlaceholderImage src={src} alt={caption} className="aspect-square rounded-2xl w-full" />
            <span className="text-xs text-ink-muted">{caption}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
