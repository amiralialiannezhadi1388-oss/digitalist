import { NextResponse } from "next/server";
import { db } from "@/db";
import { userCourses, courses, courseSessions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد شوید." }, { status: 401 });
    }

    let userCourseList;
    if (user.role === "admin") {
      // Admin has access to all courses
      userCourseList = await db.select().from(courses);
    } else {
      const enrollments = await db
        .select({
          courseId: userCourses.courseId,
          enrolledAt: userCourses.enrolledAt,
        })
        .from(userCourses)
        .where(eq(userCourses.userId, user.id))
        .orderBy(desc(userCourses.enrolledAt));

      if (enrollments.length === 0) {
        return NextResponse.json({ courses: [] });
      }

      const courseIds = enrollments.map((e) => e.courseId);
      const allCourses = await db.select().from(courses);
      userCourseList = allCourses.filter((c) => courseIds.includes(c.id));
    }

    return NextResponse.json({ courses: userCourseList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
