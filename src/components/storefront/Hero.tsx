import Link from "next/link";
import { Heart, Leaf, ShieldCheck, Truck } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const badges = [
  { icon: Truck, label: "משלוחים טריים\nלכל הארץ" },
  { icon: Heart, label: "מוכן באהבה\nלעין ולחיך" },
  { icon: Leaf, label: "פירות טריים\nבכל יום" },
  { icon: ShieldCheck, label: "איכות ללא\nפשרות" },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 pb-16 grid md:grid-cols-2 gap-10 items-center">
      <PlaceholderImage
        label="תמונת מגש פירות"
        className="aspect-square md:aspect-[4/5] rounded-3xl order-2"
      />

      <div className="order-1 flex flex-col items-center md:items-start text-center md:text-right gap-5">
        <span className="text-xs tracking-[0.25em] text-gold uppercase">
          Premium Fruit Platters
        </span>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight text-ink">
          מגשי פירות
          <br />
          טריים. יפים. טעימים.
        </h1>
        <p className="text-ink-muted">בהכנה ידנית אנו יוצרים מגשי פירות איכותיים</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-cream-alt text-ink">
                <Icon size={20} />
              </span>
              <span className="text-xs text-ink-muted whitespace-pre-line">{label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/products"
          className="mt-4 inline-block rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
        >
          הזמינו עכשיו
        </Link>
      </div>
    </section>
  );
}
