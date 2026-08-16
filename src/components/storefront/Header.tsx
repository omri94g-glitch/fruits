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
  const [homeLink, ...restLinks] = navLinks;
  const contactLink = restLinks.pop();

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
            <Link
              href="/cart"
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <ShoppingBag size={15} />
              <span>{itemCount}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 h-24 grid grid-cols-[1fr_auto_auto] items-center">
          <nav className="hidden lg:flex items-center gap-8 text-sm justify-start">
            {[homeLink, ...restLinks].reverse().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-ink/80 hover:text-green-700 transition-colors pb-1 data-[active=true]:text-green-700 data-[active=true]:font-medium data-[active=true]:after:absolute data-[active=true]:after:right-0 data-[active=true]:after:left-0 data-[active=true]:after:-bottom-0.5 data-[active=true]:after:h-0.5 data-[active=true]:after:bg-green-700"
                data-active={isActive(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="flex flex-col items-center leading-none px-6">
            <span className="font-serif text-3xl text-green-700">{siteConfig.name}</span>
            <span className="text-[10px] tracking-[0.3em] text-gold uppercase mt-1">
              מגשי פירות טריים
            </span>
          </Link>

          <nav className="flex items-center justify-end">
            {contactLink && (
              <Link
                href={contactLink.href}
                className="hidden lg:inline text-sm text-ink/80 hover:text-green-700 transition-colors data-[active=true]:text-green-700 data-[active=true]:font-medium"
                data-active={isActive(contactLink.href)}
              >
                {contactLink.label}
              </Link>
            )}
            <Link
              href="/cart"
              className="lg:hidden flex items-center gap-1 text-ink/80"
              aria-label="עגלת קניות"
            >
              <ShoppingBag size={20} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "סגירת תפריט" : "פתיחת תפריט"}
              className="lg:hidden flex items-center text-ink/80 mr-4"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-line flex flex-col items-center gap-1 py-4">
            {[homeLink, ...restLinks, contactLink].filter(Boolean).map((link) => (
              <Link
                key={link!.href}
                href={link!.href}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2 text-sm text-ink/80 hover:text-green-700 data-[active=true]:text-green-700 data-[active=true]:font-medium transition-colors"
                data-active={isActive(link!.href)}
              >
                {link!.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
