import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const body = await req.json(); // key-value pairs

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        const [existing] = await db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.key, key))
          .limit(1);

        if (existing) {
          await db
            .update(siteSettings)
            .set({ value, updatedAt: new Date() })
            .where(eq(siteSettings.key, key));
        } else {
          await db.insert(siteSettings).values({ key, value });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
