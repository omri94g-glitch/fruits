import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/order-number";
import { createCardcomPayment, isCardcomConfigured } from "@/lib/payments/cardcom";
import { createPayPlusPayment, isPayPlusConfigured } from "@/lib/payments/payplus";
import { getAddOn } from "@/lib/add-ons";
import { getDeliveryQuote, UNSERVED_CITY_MESSAGE } from "@/lib/delivery";
import { normalizePhone } from "@/lib/phone";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, "נא להזין שם מלא"),
    phone: z
      .string()
      .trim()
      .min(1, "נא להזין מספר טלפון")
      .refine(
        (val) => (val.match(/\d/g) || []).length >= 9,
        "מספר הטלפון לא תקין - נדרשות לפחות 9 ספרות"
      ),
    email: z.string().trim().email("כתובת האימייל לא תקינה").optional().or(z.literal("")),
    marketingConsent: z.boolean().optional(),
  }),
  delivery: z.object({
    address: z.string().trim().min(3, "נא להזין כתובת למשלוח"),
    city: z.string().trim().min(2, "נא להזין עיר"),
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
        addOnIds: z.array(z.string()).optional(),
      })
    )
    .min(1, "העגלה ריקה"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    // Surface the first specific validation message rather than a generic
    // "invalid details" - the checkout page shows `error` verbatim, and
    // without this a customer has no way to know which field is wrong.
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message || "פרטים לא תקינים", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { customer, delivery, items } = parsed.data;

  const deliveryQuote = getDeliveryQuote(delivery.city);
  if (!deliveryQuote) {
    return NextResponse.json({ error: UNSERVED_CITY_MESSAGE }, { status: 400 });
  }

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
    const addOns = (item.addOnIds ?? [])
      .map((id) => getAddOn(id))
      .filter((a): a is NonNullable<typeof a> => Boolean(a));
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);

    return {
      productId: variant.productId,
      variantId: variant.id,
      nameSnapshot: `${variant.product.name} - ${variant.label}`,
      quantity: item.quantity,
      unitPrice: Number(variant.price) + addOnsTotal,
      addOns: addOns.length > 0 ? addOns : undefined,
    };
  });

  const itemsTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
  const totalAmount = itemsTotal + deliveryQuote.fee;

  // Match on the normalized phone, or the raw string for customers saved before
  // normalization existed, so a returning customer isn't duplicated.
  const phone = normalizePhone(customer.phone);
  const wantsMarketing = customer.marketingConsent === true;

  let dbCustomer = await db.customer.findFirst({
    where: { phone: { in: [phone, customer.phone] } },
  });
  if (!dbCustomer) {
    dbCustomer = await db.customer.create({
      data: {
        name: customer.name,
        phone,
        email: customer.email || null,
        marketingConsent: wantsMarketing,
        marketingConsentAt: wantsMarketing ? new Date() : null,
      },
    });
  } else if (wantsMarketing && !dbCustomer.marketingConsent) {
    // Only ever turn consent on from an explicit tick; an unticked box on a
    // later order must not silently revoke (or grant) anything.
    dbCustomer = await db.customer.update({
      where: { id: dbCustomer.id },
      data: { marketingConsent: true, marketingConsentAt: new Date() },
    });
  }

  const order = await db.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerId: dbCustomer.id,
      deliveryAddress: delivery.address,
      deliveryCity: deliveryQuote.city,
      deliveryDate: delivery.date ? new Date(delivery.date) : null,
      deliveryTimeSlot: delivery.timeSlot || null,
      cardMessage: delivery.cardMessage || null,
      deliveryFee: deliveryQuote.fee,
      totalAmount,
      items: { create: orderItems },
      statusHistory: { create: { status: "NEW", changedBy: "customer" } },
    },
  });

  const appUrl = process.env.APP_URL || new URL(request.url).origin;
  const successUrl = `${appUrl}/checkout/success?order=${order.orderNumber}`;
  const failedUrl = `${appUrl}/checkout/fail?order=${order.orderNumber}`;

  // PayPlus is the primary provider once configured; Cardcom stays as a
  // fallback if it's ever configured instead/again. Neither configured ->
  // dev-mode bypass so the rest of the flow stays testable locally.
  if (isPayPlusConfigured()) {
    try {
      const payment = await createPayPlusPayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: totalAmount,
        customerName: customer.name,
        customerEmail: customer.email || undefined,
        customerPhone: customer.phone,
        successUrl,
        failedUrl,
        webhookUrl: `${appUrl}/api/payments/webhook/payplus`,
      });

      await db.order.update({
        where: { id: order.id },
        data: { paymentProvider: "payplus", paymentRef: payment.transactionUid },
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

  if (isCardcomConfigured()) {
    try {
      const payment = await createCardcomPayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: totalAmount,
        customerName: customer.name,
        customerEmail: customer.email || undefined,
        successUrl,
        failedUrl,
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

  // No payment provider configured (local dev without merchant credentials) -
  // skip straight to the success page so the rest of the flow stays testable.
  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    redirectUrl: `/checkout/success?order=${order.orderNumber}`,
  });
}
