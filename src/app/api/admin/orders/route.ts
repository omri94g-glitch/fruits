import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/require-admin";

function isOrderStatus(value: string): value is OrderStatus {
  return (Object.values(OrderStatus) as string[]).includes(value);
}

export async function GET(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const orders = await db.order.findMany({
    where: status && isOrderStatus(status) ? { status } : undefined,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
