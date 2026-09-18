import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courseSessions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id, 10);
    const sessions = await db
      .select()
      .from(courseSessions)
      .where(eq(courseSessions.courseId, courseId))
      .orderBy(asc(courseSessions.orderNum));

    return NextResponse.json({ sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const { id } = await params;
    const courseId = parseInt(id, 10);
    const body = await req.json();
    const { title, duration, videoUrl, pdfUrl, isFreePreview, description, orderNum } = body;

    if (!title || !duration) {
      return NextResponse.json(
        { error: "عنوان جلسه و مدت زمان الزامی است." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(courseSessions)
      .values({
        courseId,
        orderNum: orderNum ? Number(orderNum) : 1,
        title,
        duration,
        videoUrl: videoUrl || null,
        pdfUrl: pdfUrl || null,
        isFreePreview: Boolean(isFreePreview),
        description: description || null,
      })
      .returning();

    return NextResponse.json({ success: true, session: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
