import type { Metadata } from "next";
import { Assistant, Frank_Ruhl_Libre } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { QuickOrderProvider } from "@/lib/quick-order-context";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Rfruits | מגשי פירות טריים",
  description: "מגשי פירות טריים, יפים וטעימים - משלוחים לכל הארץ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${assistant.variable} ${frankRuhlLibre.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <Analytics />
        <CartProvider>
          <QuickOrderProvider>{children}</QuickOrderProvider>
        </CartProvider>
      </body>
    </html>
  );
}
