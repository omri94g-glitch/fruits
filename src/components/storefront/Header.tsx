"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, MessageCircle, ShoppingBag, Truck, X } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/ui/brand-icons";
import { useCart } from "@/lib/cart-context";
import { navLinks, siteConfig } from "@/lib/site-config";

function SearchParamsListener({ onChange }: { onChange: (qs: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => onChange(searchParams.toString()), [searchParams, onChange]);
  return null;
}

export function Header() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [queryString, setQueryString] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    return (hrefQuery ?? "") === queryString;
  };

  return (
    <header className="sticky top-0 z-50 bg-cream">
      <Suspense fallback={null}>
        <SearchParamsListener onChange={setQueryString} />
      </Suspense>
      <div className="bg-green-900 text-cream/90 text-xs">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gold transition-colors"
            >
              <InstagramIcon size={15} />
            </a>
            <a
              href={siteConfig.facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gold transition-colors"
            >
              <FacebookIcon size={15} />
            </a>
            <span className="hidden sm:inline">עקבו אחרינו</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-cream/80">
            <Truck size={15} />
            <span>{siteConfig.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              התחברות
            </Link>
            <a
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-gold transition-colors"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-serif text-2xl text-ink shrink-0">
              {siteConfig.name}
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-ink-muted hover:text-green-700 transition-colors pb-1 data-[active=true]:text-green-700 data-[active=true]:font-medium data-[active=true]:after:absolute data-[active=true]:after:right-0 data-[active=true]:after:left-0 data-[active=true]:after:-bottom-0.5 data-[active=true]:after:h-0.5 data-[active=true]:after:bg-green-700"
                  data-active={isActive(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-ink hover:text-green-700 transition-colors"
              aria-label="עגלת קניות"
            >
              <ShoppingBag size={19} />
              <span className="text-sm">{itemCount}</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "סגירת תפריט" : "פתיחת תפריט"}
              className="lg:hidden flex items-center text-ink"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-line flex flex-col items-center gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm text-ink-muted hover:text-green-700 data-[active=true]:text-green-700 data-[active=true]:font-medium transition-colors"
                data-active={isActive(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
