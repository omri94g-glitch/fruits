import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center flex flex-col items-center gap-4">
      <CheckCircle2 size={48} className="text-green-700" />
      <h1 className="font-serif text-3xl text-green-700">ההזמנה התקבלה בהצלחה!</h1>
      {order && (
        <p dir="ltr" className="text-ink/60">
          מספר הזמנה: {order}
        </p>
      )}
      <p className="text-ink/60">
        תודה שהזמנתם מ-Rfruits. ניצור איתכם קשר בהקדם לתיאום המשלוח.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-full bg-green-700 text-cream px-8 py-3 text-sm hover:bg-green-600 transition-colors"
      >
        חזרה למגשים
      </Link>
    </div>
  );
}
