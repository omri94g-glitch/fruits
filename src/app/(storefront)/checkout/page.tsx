"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutPage() {
  const { items, subtotal, clear, delivery, setDelivery } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    timeSlot: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (items.length > 0) trackEvent("begin_checkout", { value: subtotal, items: items.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, phone: form.phone, email: form.email },
          delivery: {
            address: form.address,
            city: delivery.deliveryCity,
            date: delivery.deliveryDate || undefined,
            timeSlot: form.timeSlot || undefined,
            cardMessage: delivery.cardMessage || undefined,
          },
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            addOnIds: i.addOns.map((a) => a.id),
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "משהו השתבש, נסו שוב");
      }

      const data = await res.json();
      clear();
      if (data.redirectUrl.startsWith("http")) {
        window.location.href = data.redirectUrl;
      } else {
        router.push(data.redirectUrl);
      }
    } catch (err) {
      trackEvent("payment_error", { message: err instanceof Error ? err.message : "unknown" });
      setError(err instanceof Error ? err.message : "משהו השתבש, נסו שוב");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-2xl text-ink mb-4">העגלה שלכם ריקה</h1>
        <Link
          href="/products"
          className="inline-block rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
        >
          לצפייה במגשים
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 grid md:grid-cols-[1.4fr_1fr] gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h1 className="font-serif text-2xl text-ink">פרטי משלוח ותשלום</h1>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="שם מלא" value={form.name} onChange={update("name")} required />
          <Field label="טלפון" value={form.phone} onChange={update("phone")} required dir="ltr" />
        </div>
        <Field label="אימייל (לא חובה)" type="email" value={form.email} onChange={update("email")} dir="ltr" />

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="עיר"
            value={delivery.deliveryCity}
            onChange={(e) => setDelivery({ deliveryCity: e.target.value })}
            required
          />
          <Field label="כתובת למשלוח" value={form.address} onChange={update("address")} required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="תאריך משלוח מבוקש"
            type="date"
            value={delivery.deliveryDate}
            onChange={(e) => setDelivery({ deliveryDate: e.target.value })}
          />
          <Field label="שעת משלוח מועדפת" value={form.timeSlot} onChange={update("timeSlot")} placeholder="לדוגמה: 10:00-14:00" />
        </div>

        <Field
          label="הקדשה לכרטיס (לא חובה)"
          value={delivery.cardMessage}
          onChange={(e) => setDelivery({ cardMessage: e.target.value })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {submitting ? "שולח הזמנה..." : "מעבר לתשלום"}
        </button>
      </form>

      <div className="bg-cream-alt rounded-2xl p-6 h-fit flex flex-col gap-4">
        <h2 className="font-serif text-lg text-ink">סיכום הזמנה</h2>
        {items.map((item) => {
          const addOnsTotal = item.addOns.reduce((sum, a) => sum + a.price, 0);
          return (
            <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
              <span>
                {item.name} ({item.variantLabel}) × {item.quantity}
                {item.addOns.length > 0 && (
                  <span className="block text-xs text-ink-muted">
                    {item.addOns.map((a) => a.label).join(", ")}
                  </span>
                )}
              </span>
              <span>{(item.price + addOnsTotal) * item.quantity} ₪</span>
            </div>
          );
        })}
        <div className="flex justify-between border-t border-line pt-3 font-medium">
          <span>סה&quot;כ</span>
          <span>{subtotal} ₪</span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  dir,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-ink-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        dir={dir}
        placeholder={placeholder}
        className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
      />
    </label>
  );
}
