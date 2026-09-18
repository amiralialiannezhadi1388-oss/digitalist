import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq, ilike, and, desc, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    let query = db.select().from(courses).$dynamic();
    const conditions = [];

    if (category && category !== "all") {
      conditions.push(eq(courses.category, category));
    }

    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (sort === "cheapest") {
      query = query.orderBy(asc(courses.price));
    } else if (sort === "expensive") {
      query = query.orderBy(desc(courses.price));
    } else {
      query = query.orderBy(desc(courses.id));
    }

    const items = await query;
    return NextResponse.json({ courses: items });
  } catch (error: any) {
    console.error("Courses GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "دسترسی غیرمجاز است." }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      titleEn,
      category,
      instructor,
      price,
      originalPrice,
      discountPercent,
      image,
      previewVideoUrl,
      description,
      shortDescription,
      level,
      durationHours,
      sessionsCount,
      prerequisites,
      isFeatured,
    } = body;

    if (!title || !price || !category) {
      return NextResponse.json(
        { error: "عنوان دوره، قیمت و دسته‌بندی الزامی هستند." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug?.trim() ||
      title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);

    const [created] = await db
      .insert(courses)
      .values({
        slug: generatedSlug,
        title,
        titleEn: titleEn || null,
        category,
        instructor: instructor || "هکر امیر",
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discountPercent: discountPercent ? Number(discountPercent) : 0,
        image: image || "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        previewVideoUrl: previewVideoUrl || null,
        description: description || title,
        shortDescription: shortDescription || null,
        level: level || "مقدماتی تا حرفه‌ای",
        durationHours: durationHours ? Number(durationHours) : 12,
        sessionsCount: sessionsCount ? Number(sessionsCount) : 10,
        prerequisites: prerequisites || null,
        isFeatured: Boolean(isFeatured),
      })
      .returning();

    return NextResponse.json({ success: true, course: created });
  } catch (error: any) {
    console.error("Courses POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
