"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("אימייל או סיסמה שגויים");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5 bg-cream-alt/60 border border-line rounded-2xl p-8"
      >
        <div className="text-center">
          <span className="font-serif text-2xl text-ink">Rfruits</span>
          <p className="text-sm text-ink-muted mt-1">כניסת ניהול</p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">אימייל</span>
          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-ink-muted">סיסמה</span>
          <input
            type="password"
            required
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-line px-4 py-2.5 outline-none focus:ring-1 focus:ring-green-700 bg-cream"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-green-700 text-cream py-3 text-sm hover:bg-green-600 transition-colors disabled:opacity-60"
        >
          {submitting ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </div>
  );
}
