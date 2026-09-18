import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.id));

    return NextResponse.json({ users: allUsers });
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

    const { userId, role, phone, name } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "شناسه کاربر الزامی است." }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (phone !== undefined) updateData.phone = phone;
    if (name) updateData.name = name;

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(userId, 10)))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        phone: users.phone,
      });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
