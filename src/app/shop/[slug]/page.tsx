import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq, or, and, desc } from "drizzle-orm";
import ProductDetailsView from "@/components/ProductDetailsView";
import type { Metadata } from "next";

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);

  let [product] = await db
    .select()
    .from(products)
    .where(isNumeric ? or(eq(products.id, parseInt(slug, 10)), eq(products.slug, slug)) : eq(products.slug, slug))
    .limit(1);

  if (!product) {
    return { title: "محصول یافت نشد | دیجیتالیست" };
  }

  return {
    title: `${product.name} | فروشگاه دیجیتالیست`,
    description: product.shortDescription || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const isNumeric = /^\d+$/.test(slug);

  const [product] = await db
    .select()
    .from(products)
    .where(isNumeric ? or(eq(products.id, parseInt(slug, 10)), eq(products.slug, slug)) : eq(products.slug, slug))
    .limit(1);

  if (!product) {
    notFound();
  }

  const productReviews = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.itemType, "product"), eq(reviews.itemId, product.id)))
    .orderBy(desc(reviews.id));

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailsView product={product} initialReviews={productReviews} />
      </div>
    </div>
  );
}
