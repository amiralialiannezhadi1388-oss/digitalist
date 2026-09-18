import React from "react";
import Link from "next/link";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq, ilike, and, desc } from "drizzle-orm";
import CourseCard from "@/components/CourseCard";
import { BookOpen, CheckCircle, GraduationCap, Sparkles, Video } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "دوره‌های آموزشی تخصصی | دیجیتالیست هکر امیر",
  description:
    "مسترکلاس‌های جامع فتوشاپ ۲۰۲۶، پریمیر پرو، برنامه‌نویسی پایتون و آموزش نوازندگی ویولن براساس متد کلاسیک سوزوکی توسط هکر امیر.",
};

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category, search } = await searchParams;

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

  const allCourses = await query.orderBy(desc(courses.id));

  const categories = [
    { id: "all", label: "همه دوره‌ها" },
    { id: "photoshop", label: "فتوشاپ (Photoshop)" },
    { id: "premiere", label: "پریمیر (Premiere)" },
    { id: "python", label: "پایتون (Python)" },
    { id: "violin", label: "ویولن (متد سوزوکی)" },
  ];

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-right space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <GraduationCap className="w-4 h-4" />
            <span>آکادمی آموزش دیجیتالیست</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            دوره‌های تخصصی برنامه‌نویسی، تدوین، گرافیک و موسیقی
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            آموزش‌های کاربردی و بازارکاری تهیه شده توسط هکر امیر با پشتیبانی دائمی و دسترسی آنی پس از خرید.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected =
              (!category && cat.id === "all") || category === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/courses" : `/courses?category=${cat.id}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/50"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>

        {/* Academy Highlights Card */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">مشاهده مستقیم آنلاین</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              بدون نیاز به نرم‌افزارهای پیچیده؛ جلسات ویدیویی را با کیفیت فول اچ‌دی مستقیماً در پنل کاربری مشاهده نمایید.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">فایل‌های تمرینی و پروژه‌محور</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              تمام سورس‌کدها، فایل‌های لایه‌باز PSD، فایل‌های پروژه پریمیر و نت‌های موسیقی سوزوکی در اختیار شما قرار می‌گیرد.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">ارتباط مستقیم با هکر امیر</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              رفع اشکال تخصصی، راهنمایی گام‌به‌گام و تمرین‌های اصلاحی تکنیک‌های دست در نوازندگی و برنامه‌نویسی.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
