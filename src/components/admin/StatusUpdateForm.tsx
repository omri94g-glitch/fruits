"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "./OrderStatusBadge";

export function StatusUpdateForm({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("עדכון הסטטוס נכשל");
      return;
    }
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-700 bg-cream"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={saving || status === currentStatus}
        className="rounded-full bg-green-700 text-cream px-5 py-2 text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {saving ? "מעדכן..." : "עדכון סטטוס"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}
