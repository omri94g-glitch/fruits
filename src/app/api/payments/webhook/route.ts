import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCardcomPaymentResult } from "@/lib/payments/cardcom";

// Cardcom posts here after a payment attempt, but the payload itself is not
// trusted - we always call back to Cardcom's GetLpResult API to confirm the
// authoritative status before touching the order.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lowProfileId = body?.LowProfileId ?? body?.lowprofilecode;

  if (!lowProfileId) {
    return NextResponse.json({ error: "Missing LowProfileId" }, { status: 400 });
  }

  const result = await getCardcomPaymentResult(lowProfileId);
  const orderId = result.ReturnValue;

  if (!orderId) {
    return NextResponse.json({ error: "Missing ReturnValue" }, { status: 400 });
  }

  const order = await db.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const paid =
    result.ResponseCode === 0 && result.TranzactionInfo?.ResponseCode === 0;

  if (paid) {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });
    await db.orderStatusHistory.create({
      data: { orderId: order.id, status: "CONFIRMED", changedBy: "cardcom-webhook" },
    });
  } else {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
