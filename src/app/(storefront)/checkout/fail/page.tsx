import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CheckoutFailPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center flex flex-col items-center gap-4">
      <XCircle size={48} className="text-red-600" />
      <h1 className="font-serif text-3xl text-ink">התשלום לא הושלם</h1>
      {order && (
        <p dir="ltr" className="text-ink-muted">
          מספר הזמנה: {order}
        </p>
      )}
      <p className="text-ink-muted">
        אירעה תקלה בתהליך הסליקה. ניתן לנסות שוב, או ליצור איתנו קשר לסיוע.
      </p>
      <div className="flex gap-3 mt-4">
        <Link
          href="/checkout"
          className="rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
        >
          ניסיון נוסף
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-green-700 text-green-700 px-8 py-3 text-sm hover:bg-green-700 hover:text-cream transition-colors"
        >
          צור קשר
        </Link>
      </div>
    </div>
  );
}
