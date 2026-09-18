"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { Heart, Trash2, ShoppingCart, ShoppingBag, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistItems() {
      if (wishlist.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        const courseRes = await fetch("/api/courses");
        const courseData = await courseRes.json();

        const allProds = prodData.products || [];
        const allCourses = courseData.courses || [];

        const loaded = wishlist
          .map((w) => {
            if (w.type === "product") {
              const p = allProds.find((prod: any) => prod.id === w.id);
              return p ? { ...p, itemType: "product" } : null;
            } else {
              const c = allCourses.find((course: any) => course.id === w.id);
              return c ? { ...c, itemType: "course" } : null;
            }
          })
          .filter(Boolean);

        setItems(loaded);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadWishlistItems();
  }, [wishlist]);

  if (wishlist.length === 0) {
    return (
      <div className="w-full min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          لیست علاقه‌مندی‌های شما خالی است
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          با کلیک روی آیکون قلب در کنار هر محصول یا دوره، آن را در این لیست ذخیره کنید.
        </p>
        <Link
          href="/shop"
          className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
        >
          مشاهده محصولات فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-right">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            لیست علاقه‌مندی‌های من
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {wishlist.length} آیتم مورد علاقه ذخیره شده
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={`${item.itemType}-${item.id}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image src={item.image} alt={item.name || item.title} fill className="object-cover" />
                  <button
                    onClick={() => toggleWishlist(item.id, item.itemType)}
                    className="absolute top-2 left-2 p-1.5 rounded-lg bg-slate-900/70 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                    title="حذف از لیست"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    {item.itemType === "course" ? "دوره آموزشی" : item.categoryName || "محصول"}
                  </span>
                  <Link
                    href={
                      item.itemType === "course"
                        ? `/courses/${item.slug}`
                        : `/shop/${item.slug}`
                    }
                    className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-sky-500 mt-1 line-clamp-2"
                  >
                    {item.name || item.title}
                  </Link>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                  {formatPrice(item.price)}
                </span>

                <button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      type: item.itemType,
                      title: item.name || item.title,
                      price: item.price,
                      image: item.image,
                      slug: item.slug,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>افزودن به سبد</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
