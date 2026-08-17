import { Star } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const testimonials = [
  { name: "לקוח/ה מרוצה", quote: "המגש הגיע בזמן, טרי ומסודר להפליא. ממליצים בחום!" },
  { name: "לקוח/ה מרוצה", quote: "שירות אדיב והתאמה מושלמת לאירוע שלנו." },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-4 gap-6 items-center">
      <PlaceholderImage className="hidden md:flex aspect-square rounded-2xl" />

      <div className="md:col-span-2 flex flex-col items-center text-center gap-6">
        <div>
          <span className="text-xs tracking-[0.25em] text-gold uppercase">לקוחות מספרים</span>
          <h2 className="font-serif text-3xl text-ink mt-2">כשטריות ואיכות נפגשים</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-cream-alt rounded-2xl p-5 flex flex-col gap-2">
              <p className="text-sm text-ink">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex justify-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="text-xs text-ink-muted">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <PlaceholderImage className="hidden md:flex aspect-square rounded-2xl" />
    </section>
  );
}
