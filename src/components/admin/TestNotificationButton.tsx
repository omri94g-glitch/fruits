"use client";

import { useState } from "react";

export function TestNotificationButton() {
  const [state, setState] = useState<{ kind: "idle" | "sending" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const send = async () => {
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/admin/notifications/test", { method: "POST" });
      const body = await res.json().catch(() => null);
      if (res.ok) setState({ kind: "ok", message: "נשלחה הודעת בדיקה - בדוק את תיבת הדואר (וגם את הספאם)." });
      else setState({ kind: "error", message: body?.error ?? "השליחה נכשלה" });
    } catch {
      setState({ kind: "error", message: "השליחה נכשלה" });
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        type="button"
        onClick={send}
        disabled={state.kind === "sending"}
        className="rounded-full border border-line px-4 py-1.5 text-ink-muted hover:border-green-700 hover:text-green-700 transition-colors disabled:opacity-50"
      >
        {state.kind === "sending" ? "שולח..." : "שליחת התראת בדיקה"}
      </button>
      {state.message && (
        <span role={state.kind === "error" ? "alert" : "status"} className={state.kind === "error" ? "text-red-600" : "text-ink-muted"}>
          {state.message}
        </span>
      )}
    </div>
  );
}
