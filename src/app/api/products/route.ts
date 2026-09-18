import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, and, gte, lte, desc, asc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort"); // 'cheapest' | 'expensive' | 'newest' | 'rating'
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock");

    let query = db.select().from(products).$dynamic();
    const conditions = [];

    if (category && category !== "all") {
      conditions.push(eq(products.category, category));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    if (inStock === "true") {
      conditions.push(gte(products.stock, 1));
    }

    if (minPrice) {
      conditions.push(gte(products.price, parseInt(minPrice, 10)));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, parseInt(maxPrice, 10)));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (sort === "cheapest") {
      query = query.orderBy(asc(products.price));
    } else if (sort === "expensive") {
      query = query.orderBy(desc(products.price));
    } else if (sort === "rating") {
      query = query.orderBy(desc(products.rating));
    } else {
      query = query.orderBy(desc(products.id));
    }

    const items = await query;
    return NextResponse.json({ products: items });
  } catch (error: any) {
    console.error("Products GET error:", error);
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
      name,
      slug,
      nameEn,
      category,
      categoryName,
      price,
      originalPrice,
      discountPercent,
      stock,
      image,
      gallery,
      description,
      shortDescription,
      specs,
      tags,
      isFeatured,
      isNew,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: "نام، قیمت و دسته‌بندی محصول الزامی هستند." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug?.trim() ||
      name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);

    const [created] = await db
      .insert(products)
      .values({
        slug: generatedSlug,
        name,
        nameEn: nameEn || null,
        category,
        categoryName: categoryName || category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discountPercent: discountPercent ? Number(discountPercent) : 0,
        stock: stock ? Number(stock) : 5,
        image: image || "https://images.pexels.com/photos/11047223/pexels-photo-11047223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
        description: description || name,
        shortDescription: shortDescription || null,
        specs: typeof specs === "string" ? specs : JSON.stringify(specs || {}),
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        isFeatured: Boolean(isFeatured),
        isNew: isNew !== undefined ? Boolean(isNew) : true,
      })
      .returning();

    return NextResponse.json({ success: true, product: created });
  } catch (error: any) {
    console.error("Products POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
