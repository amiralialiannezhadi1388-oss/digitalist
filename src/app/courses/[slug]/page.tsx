import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses, courseSessions, reviews, userCourses } from "@/db/schema";
import { eq, or, and, asc, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import CourseDetailsView from "@/components/CourseDetailsView";
import type { Metadata } from "next";

export const revalidate = 0;

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);

  const [course] = await db
    .select()
    .from(courses)
    .where(isNumeric ? or(eq(courses.id, parseInt(slug, 10)), eq(courses.slug, slug)) : eq(courses.slug, slug))
    .limit(1);

  if (!course) {
    return { title: "دوره یافت نشد | دیجیتالیست" };
  }

  return {
    title: `${course.title} | آکادمی دیجیتالیست`,
    description: course.shortDescription || course.description.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);

  const [course] = await db
    .select()
    .from(courses)
    .where(isNumeric ? or(eq(courses.id, parseInt(slug, 10)), eq(courses.slug, slug)) : eq(courses.slug, slug))
    .limit(1);

  if (!course) {
    notFound();
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
    .where(and(eq(reviews.itemType, "course"), eq(reviews.itemId, course.id)))
    .orderBy(desc(reviews.id));

  // Check enrollment
  let isEnrolled = false;
  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.role === "admin") {
      isEnrolled = true;
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

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseDetailsView
          course={course}
          sessions={sessions}
          reviews={courseReviews}
          isEnrolled={isEnrolled}
        />
      </div>
    </div>
  );
}
