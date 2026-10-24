import { db } from "@/lib/db";
import { buildOrderEmail, type NotifyOrder } from "@/lib/order-email";

// Sends the owner an email when an order's payment is confirmed. Uses Resend's
// HTTP API directly (no SDK). Does nothing until both env vars are set, and a
// failure here must never break the payment webhook that calls it.
//   RESEND_API_KEY      - secret, entered by the owner in Vercel
//   ORDER_NOTIFY_EMAIL  - where to send; comma-separated for several
//   ORDER_NOTIFY_FROM   - optional sender. Defaults to Resend's shared test
//                         sender, which can only deliver to the email the
//                         Resend account was created with.

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Rfruits <onboarding@resend.dev>";

export function isOrderNotifyConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.ORDER_NOTIFY_EMAIL);
}

type SendResult = { ok: true } | { ok: false; error: string };

async function sendEmail(email: { subject: string; html: string; text: string }, replyTo?: string | null): Promise<SendResult> {
  const to = (process.env.ORDER_NOTIFY_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ORDER_NOTIFY_FROM || DEFAULT_FROM,
        to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => null);
    return { ok: false, error: body?.message ?? `Resend responded ${res.status}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}

function adminUrlFor(orderId: string) {
  return `${process.env.APP_URL ?? ""}/admin/orders/${orderId}`;
}

export async function notifyNewPaidOrder(orderId: string) {
  if (!isOrderNotifyConfigured()) return;

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: true },
    });
    if (!order) return;

    const notifyOrder: NotifyOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      deliveryFee: Number(order.deliveryFee),
      discountAmount: Number(order.discountAmount),
      couponCode: order.couponCode,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryDate: order.deliveryDate,
      deliveryTimeSlot: order.deliveryTimeSlot,
      cardMessage: order.cardMessage,
      customer: { name: order.customer.name, phone: order.customer.phone, email: order.customer.email },
      items: order.items.map((item) => ({
        nameSnapshot: item.nameSnapshot,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        addOns: Array.isArray(item.addOns)
          ? (item.addOns as { label: string; price: number }[]).map((a) => ({
              label: String(a.label),
              price: Number(a.price),
            }))
          : [],
      })),
    };

    const result = await sendEmail(buildOrderEmail(notifyOrder, adminUrlFor(order.id)), order.customer.email);
    if (!result.ok) console.error(`Order notification for ${order.orderNumber} failed: ${result.error}`);
  } catch (err) {
    console.error("Order notification crashed", err);
  }
}

// Lets the owner confirm the setup works without placing a real order.
export async function sendTestNotification(): Promise<SendResult> {
  const sample: NotifyOrder = {
    id: "test",
    orderNumber: "RF-TEST",
    totalAmount: 167,
    deliveryFee: 40,
    discountAmount: 22,
    couponCode: "rfruitsfriends",
    deliveryAddress: "רחוב הדוגמה 1",
    deliveryCity: "נתניה",
    deliveryDate: new Date(),
    deliveryTimeSlot: "10:00-14:00",
    cardMessage: "הזמנה לדוגמה - אין צורך לפעול",
    customer: { name: "לקוח לדוגמה", phone: "0500000000", email: null },
    items: [{ nameSnapshot: "מגש פירות קלאסי - קטן", quantity: 1, unitPrice: 149, addOns: [] }],
  };
  return sendEmail(buildOrderEmail(sample, adminUrlFor("test"), { test: true }));
}
