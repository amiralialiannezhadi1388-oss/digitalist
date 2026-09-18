"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  Play,
  Lock,
  Unlock,
  FileText,
  Clock,
  BookOpen,
  User,
  Star,
  CheckCircle,
  ShoppingBag,
  Heart,
  Send,
  Video,
  Download,
} from "lucide-react";

interface CourseProps {
  course: {
    id: number;
    slug: string;
    title: string;
    titleEn?: string | null;
    category: string;
    instructor: string;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number | null;
    image: string;
    previewVideoUrl?: string | null;
    description: string;
    shortDescription?: string | null;
    level?: string | null;
    durationHours: number;
    sessionsCount: number;
    prerequisites?: string | null;
    rating?: string | null;
    reviewCount?: number | null;
  };
  sessions: Array<{
    id: number;
    orderNum: number;
    title: string;
    duration: string;
    videoUrl?: string | null;
    pdfUrl?: string | null;
    isFreePreview?: boolean | null;
    description?: string | null;
  }>;
  reviews: Array<{
    id: number;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
  }>;
  isEnrolled: boolean;
}

export default function CourseDetailsView({
  course,
  sessions,
  reviews: initialReviews,
  isEnrolled,
}: CourseProps) {
  const { addToCart, toggleWishlist, isWishlisted, user, showToast } = useApp();
  const wishlisted = isWishlisted(course.id, "course");

  const [activeSession, setActiveSession] = useState(sessions[0] || null);
  const [reviews, setReviews] = useState(initialReviews);
  const [newAuthor, setNewAuthor] = useState(user?.name || "");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const canAccessSession = (session: typeof activeSession) => {
    if (!session) return false;
    return isEnrolled || session.isFreePreview;
  };

  const handleEnroll = () => {
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "course",
          itemId: course.id,
          authorName: newAuthor.trim() || user?.name || "کاربر دیجیتالیست",
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setNewComment("");
        showToast("نظر شما برای این دوره با موفقیت ثبت شد.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-sky-500">
          خانه
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-sky-500">
          دوره‌ها
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {course.title}
        </span>
      </nav>

      {/* Main Course Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Right Info Section */}
        <div className="lg:col-span-7 space-y-6 text-right">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20">
                {course.category.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                سطح: {course.level || "مقدماتی تا پیشرفته"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            {course.titleEn && (
              <p className="text-xs text-slate-400 font-mono" dir="ltr">
                {course.titleEn}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {course.shortDescription || course.description.slice(0, 180)}
            </p>
          </div>

          {/* Instructor & Metadata bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="text-[10px] text-slate-400">مدرس دوره</p>
                <p className="font-bold text-slate-800 dark:text-white">{course.instructor}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>{course.durationHours} ساعت آموزش</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <span>{sessions.length || course.sessionsCount} جلسه</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{course.rating || "5.0"}</span>
              </span>
            </div>
          </div>

          {/* Pricing & Enrollment CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white border border-sky-500/30 shadow-xl space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs text-sky-300 font-medium">سرمایه‌گذاری در این دوره:</p>
                {isEnrolled ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm mt-1">
                    <CheckCircle className="w-4 h-4" /> شما در این دوره ثبت‌نام کرده‌اید
                  </span>
                ) : (
                  <p className="text-2xl font-black text-white mt-1">
                    {formatPrice(course.price)}
                  </p>
                )}
              </div>

              {!isEnrolled && course.originalPrice && course.originalPrice > course.price && (
                <div className="text-left">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500 text-white mb-1 inline-block">
                    ٪{course.discountPercent} تخفیف
                  </span>
                  <p className="text-xs line-through text-slate-400">
                    {formatPrice(course.originalPrice)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              {isEnrolled ? (
                <button
                  onClick={() => {
                    if (sessions[0]) setActiveSession(sessions[0]);
                    showToast("جلسات دوره در پلیر زیر آماده پخش است.");
                  }}
                  className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>مشاهده جلسات دوره در پلیر</span>
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ثبت‌نام و خرید این دوره</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(course.id, "course")}
                className={`p-3.5 rounded-xl border transition-colors ${
                  wishlisted
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "border-slate-700 bg-slate-800 text-white hover:bg-rose-500"
                }`}
                title="علاقه‌مندی"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Left Side: Video Player / Active Session Screen */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center">
            {activeSession && canAccessSession(activeSession) ? (
              <video
                controls
                src={activeSession.videoUrl || course.previewVideoUrl || ""}
                poster={course.image}
                className="w-full h-full object-contain"
              >
                مرورگر شما از تگ ویدئو پشتیبانی نمی‌کند.
              </video>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Lock className="w-6 h-6 text-sky-400" />
                  </div>
                  <p className="text-xs font-bold text-white">
                    {activeSession ? activeSession.title : "جلسه قفل است"}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    برای دسترسی کامل به این جلسه و فایل‌های پیوستی، در دوره ثبت‌نام فرمایید.
                  </p>
                  {!isEnrolled && (
                    <button
                      onClick={handleEnroll}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md"
                    >
                      خرید و باز کردن دوره
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {activeSession && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-right space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  جلسه فعال: {activeSession.title}
                </span>
                <span className="text-slate-400">{activeSession.duration}</span>
              </div>
              {activeSession.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeSession.description}
                </p>
              )}
              {activeSession.pdfUrl && (
                <div className="pt-2">
                  {canAccessSession(activeSession) ? (
                    <a
                      href={activeSession.pdfUrl}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`در حال دانلود فایل جزوه: ${activeSession?.title}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-500/20 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود جزوه PDF و فایل‌های این جلسه</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <Lock className="w-3 h-3" /> فایل PDF پیوست فقط برای اعضای ثبت‌نامی در دسترس است
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Syllabus / Curriculum Sessions List */}
      <div className="space-y-4 text-right pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              سرفصل‌ها و جلسات آموزشی ({sessions.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              برای مشاهده، روی هر جلسه کلیک کنید
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {sessions.map((sess, idx) => {
            const accessible = canAccessSession(sess);
            const isSelected = activeSession?.id === sess.id;
            return (
              <div
                key={sess.id}
                onClick={() => setActiveSession(sess)}
                className={`p-4 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-sky-500/10 dark:bg-sky-950/40"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                      accessible
                        ? "bg-sky-500 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {sess.orderNum || idx + 1}
                  </div>
                  <div>
                    <p
                      className={`font-bold ${
                        isSelected
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {sess.title}
                    </p>
                    <p className="text-[11px] text-slate-400">{sess.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {sess.isFreePreview && !isEnrolled && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      پیش‌نمایش رایگان
                    </span>
                  )}

                  {accessible ? (
                    <span className="flex items-center gap-1 text-sky-500 font-medium">
                      <Play className="w-3.5 h-3.5 fill-current" /> پخش
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Description & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            درباره این دوره
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {course.description}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            پیش‌نیازها و ملزومات
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.prerequisites || "این دوره از سطح پایه تدریس می‌شود و نیاز به دانش تخصصی قبلی ندارد."}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 text-right pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          نظرات دانشجویان دوره ({reviews.length})
        </h3>

        {/* Add Review */}
        <form
          onSubmit={handleReviewSubmit}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            ثبت نظر درباره تدریس هکر امیر
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400">نام شما</label>
              <input
                type="text"
                required
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="نام هنرجو یا دانشجو"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 dark:text-slate-400">امتیاز شما</label>
              <div className="flex items-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
                  {newRating} از ۵
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-500 dark:text-slate-400">متن دیدگاه شما</label>
            <textarea
              required
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="نظرتان را در مورد شیوایی بیان و سرفصل‌های آموزشی بنویسید..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={submittingReview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submittingReview ? "در حال ثبت..." : "ثبت نظر برای دوره"}</span>
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">
              هنوز نظری برای این دوره ثبت نشده است.
            </p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-right shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.authorName}
                  </span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
