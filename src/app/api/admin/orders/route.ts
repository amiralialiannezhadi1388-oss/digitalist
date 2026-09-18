import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.id));

    // Also fetch items for these orders
    const allItems = await db.select().from(orderItems);

    const ordersWithItems = allOrders.map((ord) => ({
      ...ord,
      items: allItems.filter((it) => it.orderId === ord.id),
    }));

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "شناسه سفارش و وضعیت الزامی هستند." }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, parseInt(orderId, 10)))
      .returning();

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
