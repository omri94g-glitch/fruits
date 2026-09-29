import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPayPlusTransactionStatus, verifyPayPlusWebhookSignature } from "@/lib/payments/payplus";

// PayPlus posts here after a payment attempt, but neither the payload nor its
// signature alone is enough to act on - we verify the HMAC signature to
// confirm the request genuinely came from PayPlus, then call back to their
// Transactions/View API to confirm the authoritative status before touching
// the order (never trust a webhook body's own status field).
export async function POST(request: Request) {
  const rawBody = await request.text();
  const hashHeader = request.headers.get("hash");

  const validSignature = await verifyPayPlusWebhookSignature(rawBody, hashHeader);
  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Exact field name/shape not fully confirmed against a real PayPlus
  // callback yet (see CLAUDE.md Payments section) - try the documented
  // candidates defensively; re-verify server-side regardless via the
  // transaction UID once found.
  const transactionUid: string | undefined =
    body?.transaction_uid ??
    body?.data?.transaction_uid ??
    body?.data?.transaction?.uid ??
    body?.transaction?.uid;

  if (!transactionUid) {
    return NextResponse.json({ error: "Missing transaction_uid" }, { status: 400 });
  }

  const result = await getPayPlusTransactionStatus(transactionUid);
  const orderId = result.orderId;

  if (!orderId) {
    return NextResponse.json({ error: "Missing order reference (more_info)" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (result.approved) {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, status: "CONFIRMED", changedBy: "payplus-webhook" },
    });
  } else {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
