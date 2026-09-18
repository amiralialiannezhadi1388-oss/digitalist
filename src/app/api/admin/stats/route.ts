import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, products, courses, orders } from "@/db/schema";
import { count, sum, desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const [{ value: totalUsers }] = await db.select({ value: count() }).from(users);
    const [{ value: totalProducts }] = await db.select({ value: count() }).from(products);
    const [{ value: totalCourses }] = await db.select({ value: count() }).from(courses);
    const [{ value: totalOrders }] = await db.select({ value: count() }).from(orders);

    const paidOrders = await db
      .select({ total: sum(orders.totalPrice) })
      .from(orders)
      .where(eq(orders.status, "paid"));

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.id))
      .limit(6);

    return NextResponse.json({
      stats: {
        totalUsers: Number(totalUsers),
        totalProducts: Number(totalProducts),
        totalCourses: Number(totalCourses),
        totalOrders: Number(totalOrders),
        totalSales: Number(paidOrders[0]?.total || 0),
      },
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
