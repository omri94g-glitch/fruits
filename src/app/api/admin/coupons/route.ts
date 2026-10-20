import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { normalizeCouponCode } from "@/lib/coupons";

const createSchema = z
  .object({
    code: z
      .string()
      .transform(normalizeCouponCode)
      .pipe(z.string().regex(/^[\p{L}\p{N}_-]{3,30}$/u, "הקוד חייב להכיל 3-30 תווים: אותיות, ספרות, מקף או קו תחתון")),
    type: z.enum(["percent", "amount"]),
    value: z.number().positive("ערך ההנחה חייב להיות גדול מ-0"),
    expiresAt: z.string().optional(),
    maxUses: z.number().int().positive("מגבלת השימושים חייבת להיות מספר שלם גדול מ-0").optional(),
    minOrder: z.number().positive("מינימום ההזמנה חייב להיות גדול מ-0").optional(),
  })
  .refine((d) => d.type !== "percent" || (Number.isInteger(d.value) && d.value <= 100), {
    message: "אחוז ההנחה חייב להיות מספר שלם בין 1 ל-100",
    path: ["value"],
  });

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const expiresAt = d.expiresAt ? new Date(`${d.expiresAt}T23:59:59+03:00`) : null;
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return NextResponse.json({ error: "תאריך תפוגה לא תקין" }, { status: 400 });
  }

  if (await db.coupon.findUnique({ where: { code: d.code } })) {
    return NextResponse.json({ error: "קופון עם הקוד הזה כבר קיים" }, { status: 409 });
  }

  const coupon = await db.coupon.create({
    data: {
      code: d.code,
      percentOff: d.type === "percent" ? d.value : null,
      amountOff: d.type === "amount" ? d.value : null,
      expiresAt,
      maxUses: d.maxUses ?? null,
      minOrder: d.minOrder ?? null,
    },
  });
  return NextResponse.json({ coupon }, { status: 201 });
}
