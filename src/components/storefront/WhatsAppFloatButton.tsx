"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppFloatButton() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { source: "floating_button" })}
      aria-label="פתיחת וואטסאפ"
      className="fixed bottom-5 left-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-green-700 text-cream shadow-lg hover:bg-green-600 transition-colors"
    >
      <MessageCircle size={26} />
    </a>
  );
}
