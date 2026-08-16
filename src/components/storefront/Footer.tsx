import Link from "next/link";
import { Mail, Phone, Send } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-green-900 text-cream/90 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 border-b border-cream/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/70">
            הצטרפו לניוזלטר שלנו וקבלו הטבות והצעות מיוחדות
          </p>
          <form className="flex w-full max-w-sm items-center gap-2">
            <input
              type="email"
              required
              placeholder="הכניסו כתובת מייל"
              className="flex-1 rounded-full bg-cream/10 px-4 py-2 text-sm placeholder:text-cream/50 outline-none focus:ring-1 focus:ring-gold"
            />
            <button
              type="submit"
              aria-label="הרשמה"
              className="shrink-0 rounded-full bg-gold p-2 text-green-900 hover:opacity-90 transition-opacity"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-right">
          <span className="font-serif text-2xl">{siteConfig.name}</span>
          <p className="text-cream/60">מגשי פירות | אירועים | משלוחים לכל הארץ</p>
          <div className="flex gap-3 mt-1">
            <a
              href={siteConfig.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gold transition-colors"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href={siteConfig.facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gold transition-colors"
            >
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>

        <nav className="flex flex-col items-center gap-2 text-cream/70">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center md:items-end gap-2 text-cream/70">
          <span className="text-cream mb-1">צור קשר</span>
          <a href={siteConfig.phoneHref} dir="ltr" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Phone size={14} />
            {siteConfig.phone}
          </a>
          <a href={`mailto:${siteConfig.email}`} dir="ltr" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Mail size={14} />
            {siteConfig.email}
          </a>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} כל הזכויות שמורות ל-{siteConfig.name}
      </div>
    </footer>
  );
}
