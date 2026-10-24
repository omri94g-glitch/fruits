import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { isOrderNotifyConfigured, sendTestNotification } from "@/lib/order-notify";

export async function POST() {
  const { response } = await requireAdmin();
  if (response) return response;

  if (!isOrderNotifyConfigured()) {
    return NextResponse.json(
      { error: "ההתראות עדיין לא הוגדרו - חסרים RESEND_API_KEY ו-ORDER_NOTIFY_EMAIL ב-Vercel." },
      { status: 400 }
    );
  }

  const result = await sendTestNotification();
  if (!result.ok) {
    return NextResponse.json({ error: `השליחה נכשלה: ${result.error}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
