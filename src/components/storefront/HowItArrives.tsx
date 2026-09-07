import Image from "next/image";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const shots = ["המגש המלא", "האריזה", "הברכה", "מסירת המשלוח", "המגש על שולחן אירוח"];

export function HowItArrives() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 text-center">
      <h2 className="sr-only">ככה זה מגיע אליכם</h2>
      <Image
        src="/images/see-real-thing-heading.png"
        alt="See The Real Thing - תמונות אמיתיות מהזמנות שיצאו מאיתנו, בדיוק מה שתקבלו"
        width={1500}
        height={349}
        className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md h-auto"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
        {shots.map((caption) => (
          <div key={caption} className="flex flex-col gap-2">
            <PlaceholderImage className="aspect-square rounded-2xl w-full" />
            <span className="text-xs text-ink-muted">{caption}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
