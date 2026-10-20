import { NextResponse } from "next/server";
import { z } from "zod";
import { findUsableCoupon } from "@/lib/coupons";

const bodySchema = z.object({
  code: z.string().trim().max(60),
  // Preview only (min-order check + the shown discount). Checkout recomputes
  // the real items total from the database.
  subtotal: z.number().nonnegative(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "נא להזין קוד קופון" }, { status: 400 });
  }

  const result = await findUsableCoupon(parsed.data.code, parsed.data.subtotal);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
