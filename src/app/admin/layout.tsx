import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      {session && (
        <header className="border-b border-line bg-cream-alt/40">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-serif text-xl text-ink">
                Rfruits · ניהול
              </Link>
              <nav aria-label="ניהול" className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-ink-muted hover:text-green-700">
                  הזמנות
                </Link>
                <Link href="/admin/customers" className="text-ink-muted hover:text-green-700">
                  לקוחות
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-ink-muted">{session.user?.name}</span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
