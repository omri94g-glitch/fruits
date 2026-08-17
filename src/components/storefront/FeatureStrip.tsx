import { Clock, Gem, Gift, Truck } from "lucide-react";

const features = [
  { icon: Gem, title: "איכות ללא פשרות", desc: "פירות מובחרים בסטנדרטים גבוהים" },
  { icon: Clock, title: "הזמנה קלה ונוחה", desc: "מהיר, פשוט ובטוח" },
  { icon: Truck, title: "משלוחים מהירים", desc: "משלוח עד הבית בזמן ובטיח" },
  { icon: Gift, title: "שירות אישי", desc: "מענה כאן עבורכם בכל שאלה" },
];

export function FeatureStrip() {
  return (
    <section className="bg-cream-alt py-12">
      <h2 className="font-serif text-2xl md:text-3xl text-ink text-center mb-8">
        למה לבחור ב-Rfruits
      </h2>
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center text-center gap-2">
            <Icon size={22} className="text-ink" />
            <span className="text-sm font-medium text-ink">{title}</span>
            <span className="text-xs text-ink-muted">{desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
