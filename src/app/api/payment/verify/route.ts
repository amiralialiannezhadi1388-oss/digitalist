import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, userCourses, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { orderId, success } = await req.json();
    const id = parseInt(orderId, 10);

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد." }, { status: 404 });
    }

    if (!success) {
      await db
        .update(orders)
        .set({ status: "cancelled" })
        .where(eq(orders.id, id));
      return NextResponse.json({ success: false, message: "پرداخت لغو شد یا ناموفق بود." });
    }

    const trackingCode = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;

    await db
      .update(orders)
      .set({
        status: "paid",
        paymentTrackingCode: trackingCode,
      })
      .where(eq(orders.id, id));

    // Get order items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    // Check if user is linked or find user by email
    let targetUserId = order.userId;
    if (!targetUserId && order.customerEmail) {
      const [matchedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, order.customerEmail.toLowerCase().trim()))
        .limit(1);
      if (matchedUser) {
        targetUserId = matchedUser.id;
        // Also associate user with order
        await db
          .update(orders)
          .set({ userId: matchedUser.id })
          .where(eq(orders.id, order.id));
      }
    }

    // Automatically enroll in courses
    if (targetUserId) {
      for (const item of items) {
        if (item.itemType === "course") {
          // Check if already enrolled
          const [alreadyEnrolled] = await db
            .select()
            .from(userCourses)
            .where(
              and(
                eq(userCourses.userId, targetUserId),
                eq(userCourses.courseId, item.itemId)
              )
            )
            .limit(1);

          if (!alreadyEnrolled) {
            await db.insert(userCourses).values({
              userId: targetUserId,
              courseId: item.itemId,
              orderId: order.id,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      trackingCode,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
    });
  } catch (error: any) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
