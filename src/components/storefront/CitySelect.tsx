"use client";

import { useId } from "react";
import { DELIVERY_ZONES, getDeliveryQuote } from "@/lib/delivery";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function CitySelect({
  value,
  onChange,
  required = false,
  className = "rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream",
}: {
  value: string;
  onChange: (city: string) => void;
  required?: boolean;
  className?: string;
}) {
  const helpId = useId();
  const quote = getDeliveryQuote(value);

  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <label className="flex flex-col gap-1.5">
        <span className="text-ink-muted">עיר משלוח</span>
        <select
          value={quote?.city ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-describedby={helpId}
          autoComplete="address-level2"
          className={className}
        >
          <option value="">בחרו עיר</option>
          {DELIVERY_ZONES.map((zone) => (
            <optgroup key={zone.id} label={`${zone.label} - משלוח ${zone.fee} ₪`}>
              {zone.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <p id={helpId} aria-live="polite" className="text-xs text-ink-muted">
        {quote ? (
          <>דמי משלוח: {quote.fee} ₪</>
        ) : (
          <>
            לא מוצאים את העיר שלכם?{" "}
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-green-700"
            >
              צרו קשר בוואטסאפ
            </a>
          </>
        )}
      </p>
    </div>
  );
}
