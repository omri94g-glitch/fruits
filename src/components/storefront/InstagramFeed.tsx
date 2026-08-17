import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { siteConfig } from "@/lib/site-config";

export function InstagramFeed() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 text-center">
      <h2 className="font-serif text-2xl text-ink">עקבו אחרינו באינסטגרם</h2>
      <p dir="ltr" className="text-sm text-ink-muted mt-1">{siteConfig.instagramHandle}</p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlaceholderImage key={i} className="aspect-square rounded-xl" />
        ))}
      </div>

      <a
        href={siteConfig.instagramHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-8 rounded-full border border-green-700 text-green-700 px-8 py-2.5 text-sm hover:bg-green-700 hover:text-cream transition-colors"
      >
        לעוד רעיונות והשראה
      </a>
    </section>
  );
}
