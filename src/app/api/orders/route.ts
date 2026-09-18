import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, userCourses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد شوید." }, { status: 401 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, user.id))
      .orderBy(desc(orders.id));

    return NextResponse.json({ orders: userOrders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      postalCode,
      items,
      paymentGateway = "zarinpal",
    } = body;

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "نام، ایمیل و شماره تماس الزامی هستند." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است." },
        { status: 400 }
      );
    }

    const subtotal = items.reduce(
      (sum: number, it: any) => sum + Number(it.price) * (Number(it.quantity) || 1),
      0
    );

    // Calculate has physical products for shipping
    const hasPhysicalProducts = items.some((it: any) => it.type === "product");
    const shippingCost = hasPhysicalProducts ? 65000 : 0; // 65,000 Tomans flat express shipping
    const totalPrice = subtotal + shippingCost;

    const orderNumber = `DIG-${Math.floor(100000 + Math.random() * 900000)}`;

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: user?.id || null,
        customerName: customerName.trim(),
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress?.trim() || "تحویل دیجیتال / آنلاین",
        postalCode: postalCode?.trim() || null,
        subtotal,
        discount: 0,
        shippingCost,
        totalPrice,
        status: "pending",
        paymentGateway,
        paymentTrackingCode: null,
      })
      .returning();

    // Insert order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        itemType: item.type,
        itemId: Number(item.id),
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image: item.image || null,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
