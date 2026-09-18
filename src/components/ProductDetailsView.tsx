"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";

interface ProductProps {
  product: {
    id: number;
    slug: string;
    name: string;
    nameEn?: string | null;
    category: string;
    categoryName: string;
    price: number;
    originalPrice?: number | null;
    discountPercent?: number | null;
    stock: number;
    image: string;
    gallery?: string | null;
    description: string;
    shortDescription?: string | null;
    specs?: string | null;
    tags?: string | null;
    rating?: string | null;
    reviewCount?: number | null;
    isNew?: boolean | null;
  };
  initialReviews: Array<{
    id: number;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
  }>;
}

export default function ProductDetailsView({ product, initialReviews }: ProductProps) {
  const { addToCart, toggleWishlist, isWishlisted, user, showToast } = useApp();
  const wishlisted = isWishlisted(product.id, "product");

  // Gallery images array
  let galleryImages: string[] = [product.image];
  if (product.gallery) {
    try {
      const parsed = JSON.parse(product.gallery);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    } catch {
      // fallback to main image
    }
  }

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);

  // Technical Specs
  let specsObj: Record<string, string> = {};
  if (product.specs) {
    try {
      specsObj = JSON.parse(product.specs);
    } catch {
      // fallback
    }
  }

  // Tags
  let tagsList: string[] = [];
  if (product.tags) {
    try {
      tagsList = JSON.parse(product.tags);
    } catch {
      // fallback
    }
  }

  // Reviews state
  const [reviews, setReviews] = useState(initialReviews);
  const [newAuthor, setNewAuthor] = useState(user?.name || "");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        type: "product",
        title: product.name,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        image: product.image,
        category: product.categoryName,
        slug: product.slug,
      },
      quantity
    );
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
          itemType: "product",
          itemId: product.id,
          authorName: newAuthor.trim() || user?.name || "کاربر دیجیتالیست",
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setNewComment("");
        showToast("نظر و امتیاز شما با موفقیت ثبت شد.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-sky-500">
          خانه
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-sky-500">
          فروشگاه
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery (Left side in desktop, Right in RTL DOM) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-xl text-xs font-black bg-rose-500 text-white shadow-md">
                ٪{product.discountPercent} تخفیف ویژه
              </span>
            ) : null}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img
                      ? "border-sky-500 ring-2 ring-sky-500/20 scale-105"
                      : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6 text-right">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/20">
                {product.categoryName}
              </span>
              <button
                onClick={() => toggleWishlist(product.id, "product")}
                className={`p-2.5 rounded-xl border transition-colors ${
                  wishlisted
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500"
                }`}
                title="علاقه‌مندی"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {product.nameEn && (
              <p className="text-xs text-slate-400 font-mono tracking-wide" dir="ltr">
                {product.nameEn}
              </p>
            )}

            {/* Ratings & Stock */}
            <div className="flex items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {product.rating || "5.0"}
                </span>
                <span className="text-slate-400">({reviews.length} دیدگاه ثبت شده)</span>
              </div>
              <span>•</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> موجود در انبار دیجیتالیست (نو و آکبند)
                </span>
              ) : (
                <span className="text-rose-500 font-semibold">ناموجود</span>
              )}
            </div>
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-100/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
              {product.shortDescription}
            </p>
          )}

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                قیمت نهایی محصول:
              </span>
              <div className="text-left">
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-xs line-through text-slate-400">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
                <p className="text-2xl font-black text-sky-600 dark:text-sky-400">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 w-full sm:w-36">
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  +
                </button>
                <span className="font-bold text-sm text-slate-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  -
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>افزودن به سبد خرید</span>
              </button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-500 dark:text-slate-400 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <ShieldCheck className="w-5 h-5 text-sky-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">ضمانت اصالت ۱۰۰٪</p>
              <p>قطعات آکبند و اصلی</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <Truck className="w-5 h-5 text-sky-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">ارسال سریع سراسر کشور</p>
              <p>بسته‌بندی ضربه‌گیر تخصصی</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <RotateCcw className="w-5 h-5 text-sky-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">۷ روز مهلت تست</p>
              <p>تضمین سلامت فنی</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications & Description */}
      <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800">
        {/* Technical Specs Table */}
        {Object.keys(specsObj).length > 0 && (
          <div className="space-y-4 text-right">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              مشخصات فنی و تخصصی
            </h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {Object.entries(specsObj).map(([key, val], idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-4 text-xs ${
                      idx % 2 === 0
                        ? "bg-slate-50/50 dark:bg-slate-950/30"
                        : "bg-white dark:bg-slate-900"
                    }`}
                  >
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      {key}
                    </span>
                    <span className="sm:col-span-2 text-slate-800 dark:text-slate-200 font-medium">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full Description */}
        <div className="space-y-4 text-right">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            توضیحات و نقد و بررسی محصول
          </h3>
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {product.description}
          </div>
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-right">
            <span className="text-xs text-slate-400 font-bold">برچسب‌ها:</span>
            {tagsList.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-6 text-right pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              نظرات و امتیازات خریداران ({reviews.length})
            </h3>
          </div>

          {/* Write a review form */}
          <form
            onSubmit={handleReviewSubmit}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              ثبت نظر برای «{product.name}»
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 dark:text-slate-400">نام شما</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="مثال: آرش علیزاده"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Star Rating selector */}
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
              <label className="text-xs text-slate-500 dark:text-slate-400">متن نظر شما</label>
              <textarea
                required
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="تجربه خود را از کیفیت و کارایی این محصول بنویسید..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? "در حال ثبت..." : "ارسال دیدگاه"}</span>
            </button>
          </form>

          {/* Reviews list */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">
                هنوز نظری برای این محصول ثبت نشده است. اولین نفری باشید که نظر خود را ثبت می‌کند!
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
    </div>
  );
}
