"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm text-ink-muted hover:text-green-700 transition-colors"
    >
      התנתקות
    </button>
  );
}
