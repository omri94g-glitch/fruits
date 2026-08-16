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
            <Link href="/admin" className="font-serif text-xl text-green-700">
              Rfruits · ניהול
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-ink/60">{session.user?.name}</span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
