import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq, or, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let product;
    if (isNumeric) {
      [product] = await db
        .select()
        .from(products)
        .where(or(eq(products.id, parseInt(id, 10)), eq(products.slug, id)))
        .limit(1);
    } else {
      [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, id))
        .limit(1);
    }

    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
    }

    // Fetch reviews for this product
    const productReviews = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.itemType, "product"), eq(reviews.itemId, product.id)));

    return NextResponse.json({ product, reviews: productReviews });
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
    const prodId = parseInt(id, 10);
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.categoryName !== undefined) updateData.categoryName = body.categoryName;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.discountPercent !== undefined)
      updateData.discountPercent = Number(body.discountPercent);
    if (body.stock !== undefined) updateData.stock = Number(body.stock);
    if (body.image !== undefined) updateData.image = body.image;
    if (body.gallery !== undefined)
      updateData.gallery =
        typeof body.gallery === "string" ? body.gallery : JSON.stringify(body.gallery);
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined)
      updateData.shortDescription = body.shortDescription;
    if (body.specs !== undefined)
      updateData.specs =
        typeof body.specs === "string" ? body.specs : JSON.stringify(body.specs);
    if (body.tags !== undefined)
      updateData.tags =
        typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.isNew !== undefined) updateData.isNew = Boolean(body.isNew);

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, prodId))
      .returning();

    return NextResponse.json({ success: true, product: updated });
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
    const prodId = parseInt(id, 10);

    await db.delete(products).where(eq(products.id, prodId));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
