"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "rounded-xl border border-line px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-700 bg-cream w-full";

export function CouponForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const num = (key: string) => {
      const v = String(data.get(key) ?? "").trim();
      return v === "" ? undefined : Number(v);
    };

    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: String(data.get("code") ?? ""),
        type: data.get("type"),
        value: num("value"),
        expiresAt: String(data.get("expiresAt") ?? "") || undefined,
        maxUses: num("maxUses"),
        minOrder: num("minOrder"),
      }),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "יצירת הקופון נכשלה");
      return;
    }
    form.reset();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line p-5 flex flex-col gap-4">
      <h2 className="font-medium text-sm">קופון חדש</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">קוד</span>
          <input name="code" required dir="ltr" autoComplete="off" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">סוג הנחה</span>
          <select name="type" defaultValue="percent" className={inputClass}>
            <option value="percent">אחוזים</option>
            <option value="amount">סכום קבוע (₪)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">גובה ההנחה</span>
          <input name="value" type="number" min="1" step="any" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">תוקף עד (לא חובה)</span>
          <input name="expiresAt" type="date" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">מקסימום שימושים (לא חובה)</span>
          <input name="maxUses" type="number" min="1" step="1" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">מינימום הזמנה ב-₪ (לא חובה)</span>
          <input name="minOrder" type="number" min="1" step="any" className={inputClass} />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-green-700 text-cream px-6 py-2 text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {saving ? "יוצר..." : "יצירת קופון"}
        </button>
        {error && (
          <span role="alert" className="text-sm text-red-600">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}
