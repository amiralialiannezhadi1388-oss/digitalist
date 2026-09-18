import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products, courses } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType"); // 'product' | 'course'
    const itemId = searchParams.get("itemId");

    if (!itemType || !itemId) {
      return NextResponse.json({ error: "پارامترهای نامعتبر" }, { status: 400 });
    }

    const items = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.itemType, itemType),
          eq(reviews.itemId, parseInt(itemId, 10)),
          eq(reviews.isApproved, true)
        )
      )
      .orderBy(desc(reviews.id));

    return NextResponse.json({ reviews: items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { itemType, itemId, authorName, rating, comment } = body;

    if (!itemType || !itemId || !comment || !rating) {
      return NextResponse.json(
        { error: "امتیاز و متن نظر الزامی هستند." },
        { status: 400 }
      );
    }

    const name = authorName?.trim() || user?.name || "کاربر دیجیتالیست";
    const numRating = Math.min(5, Math.max(1, Number(rating)));
    const id = parseInt(itemId, 10);

    const [newReview] = await db
      .insert(reviews)
      .values({
        itemType,
        itemId: id,
        userId: user?.id || null,
        authorName: name,
        rating: numRating,
        comment: comment.trim(),
        isApproved: true,
      })
      .returning();

    // Recalculate average rating for product or course
    const allReviews = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.itemType, itemType), eq(reviews.itemId, id)));

    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    if (itemType === "product") {
      await db
        .update(products)
        .set({
          rating: avgRating,
          reviewCount: allReviews.length,
        })
        .where(eq(products.id, id));
    } else if (itemType === "course") {
      await db
        .update(courses)
        .set({
          rating: avgRating,
          reviewCount: allReviews.length,
        })
        .where(eq(courses.id, id));
    }

    return NextResponse.json({ success: true, review: newReview, avgRating });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
