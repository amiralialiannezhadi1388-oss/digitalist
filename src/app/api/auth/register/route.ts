import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "لطفاً ایمیل، نام و کلمه عبور را وارد نمایید." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "کلمه عبور باید حداقل ۶ کاراکتر باشد." },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "این آدرس ایمیل قبلاً ثبت‌نام شده است." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Determine role (if matches admin credentials/email, could be admin, otherwise 'user')
    const role = email.toLowerCase().trim() === "1388amiralian@gmail.com" ? "admin" : "user";

    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        phone: phone?.trim() || null,
        role,
      })
      .returning();

    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as "admin" | "user",
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "خطایی در ثبت‌نام رخ داد." }, { status: 500 });
  }
}
