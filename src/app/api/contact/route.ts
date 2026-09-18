import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "نام، ایمیل و پیام الزامی هستند." },
        { status: 400 }
      );
    }

    const [saved] = await db
      .insert(contactMessages)
      .values({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || "پیام عمومی",
        message: message.trim(),
      })
      .returning();

    return NextResponse.json({ success: true, message: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.id));

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
