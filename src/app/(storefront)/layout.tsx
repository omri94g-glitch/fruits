import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickOrderModal } from "@/components/storefront/QuickOrderModal";
import { WhatsAppFloatButton } from "@/components/storefront/WhatsAppFloatButton";
import { AccessibilityMenu } from "@/components/storefront/AccessibilityMenu";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-3 focus:z-[100] focus:rounded-full focus:bg-green-700 focus:text-cream focus:px-5 focus:py-2.5 focus:text-sm"
      >
        דלגו לתוכן הראשי
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <QuickOrderModal />
      <WhatsAppFloatButton />
      <AccessibilityMenu />
    </>
  );
}
