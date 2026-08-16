import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/require-admin";

const patchSchema = z.object({
  status: z.enum(OrderStatus),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { customer: true, items: true, statusHistory: { orderBy: { changedAt: "asc" } } },
  });

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
  }

  const order = await db.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await db.orderStatusHistory.create({
    data: {
      orderId: id,
      status: parsed.data.status,
      changedBy: session!.user?.email ?? "admin",
    },
  });

  return NextResponse.json({ order });
}
