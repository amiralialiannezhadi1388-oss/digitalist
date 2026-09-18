import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, courseSessions, reviews, userCourses } from "@/db/schema";
import { eq, or, and, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let course;
    if (isNumeric) {
      [course] = await db
        .select()
        .from(courses)
        .where(or(eq(courses.id, parseInt(id, 10)), eq(courses.slug, id)))
        .limit(1);
    } else {
      [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.slug, id))
        .limit(1);
    }

    if (!course) {
      return NextResponse.json({ error: "دوره یافت نشد." }, { status: 404 });
    }

    // Fetch sessions
    const sessions = await db
      .select()
      .from(courseSessions)
      .where(eq(courseSessions.courseId, course.id))
      .orderBy(asc(courseSessions.orderNum));

    // Fetch reviews
    const courseReviews = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.itemType, "course"), eq(reviews.itemId, course.id)));

    // Check if user is enrolled
    let isEnrolled = false;
    const currentUser = await getCurrentUser();
    if (currentUser) {
      if (currentUser.role === "admin") {
        isEnrolled = true; // Admin has full access to all courses
      } else {
        const [enrolled] = await db
          .select()
          .from(userCourses)
          .where(
            and(
              eq(userCourses.userId, currentUser.id),
              eq(userCourses.courseId, course.id)
            )
          )
          .limit(1);
        if (enrolled) isEnrolled = true;
      }
    }

    return NextResponse.json({
      course,
      sessions,
      reviews: courseReviews,
      isEnrolled,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
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

    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.titleEn !== undefined) updateData.titleEn = body.titleEn;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.instructor !== undefined) updateData.instructor = body.instructor;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.discountPercent !== undefined)
      updateData.discountPercent = Number(body.discountPercent);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.previewVideoUrl !== undefined)
      updateData.previewVideoUrl = body.previewVideoUrl;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined)
      updateData.shortDescription = body.shortDescription;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.durationHours !== undefined)
      updateData.durationHours = Number(body.durationHours);
    if (body.sessionsCount !== undefined)
      updateData.sessionsCount = Number(body.sessionsCount);
    if (body.prerequisites !== undefined)
      updateData.prerequisites = body.prerequisites;
    if (body.isFeatured !== undefined)
      updateData.isFeatured = Boolean(body.isFeatured);

    const [updated] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, courseId))
      .returning();

    return NextResponse.json({ success: true, course: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
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

    // Delete sessions first
    await db.delete(courseSessions).where(eq(courseSessions.courseId, courseId));
    await db.delete(courses).where(eq(courses.id, courseId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
