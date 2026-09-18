import React from "react";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, and, gte, lte, desc, asc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import { ShoppingBag, SlidersHorizontal, Sparkles } from "lucide-react";

export const revalidate = 0; // dynamic

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { category, search, sort, minPrice, maxPrice, inStock } = params;

  let query = db.select().from(products).$dynamic();
  const conditions = [];

  if (category && category !== "all") {
    conditions.push(eq(products.category, category));
  }

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
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

  const allProducts = await query;

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="text-right space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <ShoppingBag className="w-4 h-4" />
            <span>فروشگاه اختصاصی دیجیتالیست</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            سیستم‌های کامپیوتر، سازهای ویولن و قطعات نو
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            تمام محصولات نو، آکبند و با ضمانت اصالت فیزیکی و تست اختصاصی ارسال می‌شوند.
          </p>
        </div>

        {/* Filter Bar & Category Pills */}
        <ShopFilters currentCategory={category} currentSort={sort} currentSearch={search} />

        {/* Product Count & Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              نمایش <strong className="text-sky-500">{allProducts.length}</strong> محصول
            </span>
          </div>

          {allProducts.length === 0 ? (
            <div className="p-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                محصولی با این مشخصات یافت نشد
              </h3>
              <p className="text-xs text-slate-400">
                لطفاً فیلترها را تغییر داده یا عبارت دیگری جستجو فرمایید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
