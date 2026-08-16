import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/order-number";
import { createCardcomPayment, isCardcomConfigured } from "@/lib/payments/cardcom";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2),
    phone: z.string().trim().min(9),
    email: z.string().trim().email().optional().or(z.literal("")),
  }),
  delivery: z.object({
    address: z.string().trim().min(3),
    city: z.string().trim().min(2),
    date: z.string().trim().optional(),
    timeSlot: z.string().trim().optional(),
    cardMessage: z.string().trim().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "פרטים לא תקינים", issues: parsed.error.issues }, { status: 400 });
  }

  const { customer, delivery, items } = parsed.data;

  const variants = await db.productVariant.findMany({
    where: { id: { in: items.map((i) => i.variantId) } },
    include: { product: true },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const orderItems = items.map((item) => {
    const variant = variantMap.get(item.variantId);
    if (!variant || variant.productId !== item.productId) {
      throw new Error("מוצר לא נמצא");
    }
    return {
      productId: variant.productId,
      variantId: variant.id,
      nameSnapshot: `${variant.product.name} - ${variant.label}`,
      quantity: item.quantity,
      unitPrice: variant.price,
    };
  });

  const totalAmount = orderItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );

  let dbCustomer = await db.customer.findFirst({ where: { phone: customer.phone } });
  if (!dbCustomer) {
    dbCustomer = await db.customer.create({
      data: { name: customer.name, phone: customer.phone, email: customer.email || null },
    });
  }

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: dbCustomer.id,
      deliveryAddress: delivery.address,
      deliveryCity: delivery.city,
      deliveryDate: delivery.date ? new Date(delivery.date) : null,
      deliveryTimeSlot: delivery.timeSlot || null,
      cardMessage: delivery.cardMessage || null,
      totalAmount,
      items: { create: orderItems },
      statusHistory: { create: { status: "NEW", changedBy: "customer" } },
    },
  });

  if (!isCardcomConfigured()) {
    // No payment provider configured yet (local dev without merchant credentials) -
    // skip straight to the success page so the rest of the flow stays testable.
    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: `/checkout/success?order=${order.orderNumber}`,
    });
  }

  const appUrl = process.env.APP_URL || new URL(request.url).origin;

  try {
    const payment = await createCardcomPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      customerName: customer.name,
      customerEmail: customer.email || undefined,
      successUrl: `${appUrl}/checkout/success?order=${order.orderNumber}`,
      failedUrl: `${appUrl}/checkout/fail?order=${order.orderNumber}`,
      webhookUrl: `${appUrl}/api/payments/webhook`,
    });

    await db.order.update({
      where: { id: order.id },
      data: { paymentProvider: "cardcom", paymentRef: payment.lowProfileId },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      redirectUrl: payment.url,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "שגיאה ביצירת עסקת סליקה",
        orderNumber: order.orderNumber,
      },
      { status: 502 }
    );
  }
}
