import { siteConfig } from "@/lib/site-config";

const WHATSAPP_NUMBER = siteConfig.whatsappHref.replace("https://wa.me/", "");

type WhatsAppOrderContext = {
  productName?: string;
  variantLabel?: string;
  date?: string;
  city?: string;
};

export function buildWhatsAppLink(context: WhatsAppOrderContext = {}): string {
  const { productName, variantLabel, date, city } = context;

  let message: string;
  if (productName) {
    const parts = [`היי, אני מתעניין/ת ב-${productName}`];
    if (variantLabel) parts.push(`בגודל ${variantLabel}`);
    if (date) parts.push(`לתאריך ${date}`);
    if (city) parts.push(`למשלוח ל-${city}`);
    message = parts.join(", ") + ".";
  } else {
    message = "היי, אשמח לעזרה בבחירת מגש פירות מתאים.";
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
