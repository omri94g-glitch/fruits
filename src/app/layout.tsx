import type { Metadata } from "next";
import { Rubik, David_Libre } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import { QuickOrderProvider } from "@/lib/quick-order-context";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
});

const davidLibre = David_Libre({
  variable: "--font-david-libre",
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
      className={`${rubik.variable} ${davidLibre.variable} h-full antialiased`}
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
