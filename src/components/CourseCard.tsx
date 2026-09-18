"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { BookOpen, Clock, Heart, ShoppingBag, Star, UserCheck } from "lucide-react";

export interface CourseType {
  id: number;
  slug: string;
  title: string;
  category: string;
  instructor: string;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number | null;
  image: string;
  sessionsCount: number;
  durationHours: number;
  rating?: string | null;
  reviewCount?: number | null;
}

export default function CourseCard({ course }: { course: CourseType }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const wishlisted = isWishlisted(course.id, "course");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: course.id,
      type: "course",
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice || undefined,
      image: course.image,
      category: "دوره آموزشی",
      slug: course.slug,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(course.id, "course");
  };

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-500/5">
      <div>
        {/* Thumbnail */}
        <Link href={`/courses/${course.slug}`} className="block relative aspect-video w-full overflow-hidden bg-slate-950">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {course.discountPercent && course.discountPercent > 0 ? (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-500 text-white shadow-sm">
                ٪{course.discountPercent} تخفیف
              </span>
            ) : null}
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all ${
              wishlisted
                ? "bg-rose-500 text-white shadow-md"
                : "bg-slate-900/60 text-white hover:bg-rose-500 hover:text-white"
            }`}
            title="افزودن به علاقه‌مندی‌ها"
          >
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>

          <div className="absolute bottom-2.5 right-3 text-right">
            <span className="text-[11px] font-semibold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-500/30">
              مدرس: {course.instructor}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 text-right space-y-3">
          <Link href={`/courses/${course.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Metadata */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>{course.durationHours} ساعت</span>
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>{course.sessionsCount} جلسه</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating || "5.0"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0 mt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
        <div className="text-right">
          {course.originalPrice && course.originalPrice > course.price && (
            <p className="text-[10px] line-through text-slate-400">
              {formatPrice(course.originalPrice)}
            </p>
          )}
          <p className="text-sm font-black text-sky-600 dark:text-sky-400">
            {formatPrice(course.price)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ثبت‌نام</span>
        </button>
      </div>
    </div>
  );
}
