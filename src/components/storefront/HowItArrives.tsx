import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const shots = ["המגש המלא", "האריזה", "הברכה", "מסירת המשלוח", "המגש על שולחן אירוח"];

export function HowItArrives() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 text-center">
      <span className="text-xs tracking-[0.25em] text-gold uppercase">See The Real Thing</span>
      <h2 className="font-serif text-2xl md:text-3xl text-ink mt-2">ככה זה מגיע אליכם</h2>
      <p className="text-ink-muted mt-2 max-w-xl mx-auto">
        תמונות אמיתיות מהזמנות שיצאו מאיתנו - בדיוק מה שתקבלו.
      </p>

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
