"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CouponToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    setSaving(true);
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      className="text-sm underline underline-offset-2 text-ink-muted hover:text-green-700 disabled:opacity-50"
    >
      {active ? "כיבוי" : "הפעלה"}
    </button>
  );
}
