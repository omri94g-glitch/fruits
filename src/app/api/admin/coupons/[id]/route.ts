import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

const patchSchema = z.object({ active: z.boolean() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const coupon = await db.coupon.update({ where: { id }, data: { active: parsed.data.active } }).catch(() => null);
  if (!coupon) return NextResponse.json({ error: "הקופון לא נמצא" }, { status: 404 });
  return NextResponse.json({ coupon });
}
