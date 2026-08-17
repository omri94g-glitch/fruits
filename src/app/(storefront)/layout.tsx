import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickOrderModal } from "@/components/storefront/QuickOrderModal";
import { WhatsAppFloatButton } from "@/components/storefront/WhatsAppFloatButton";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <QuickOrderModal />
      <WhatsAppFloatButton />
    </>
  );
}
