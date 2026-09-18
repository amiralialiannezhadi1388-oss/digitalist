"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import { Heart, ShoppingCart, Star, Check } from "lucide-react";

export interface ProductType {
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
  rating?: string | null;
  reviewCount?: number | null;
  isNew?: boolean | null;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const wishlisted = isWishlisted(product.id, "product");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      type: "product",
      title: product.name,
      price: product.price,
      originalPrice: product.originalPrice || undefined,
      image: product.image,
      category: product.categoryName,
      slug: product.slug,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, "product");
  };

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/40 dark:hover:border-sky-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-sky-500/5">
      <div>
        {/* Image Container */}
        <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-500 text-white shadow-sm">
                ٪{product.discountPercent} تخفیف
              </span>
            ) : null}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-500 text-white shadow-sm">
                نو و آکبند
              </span>
            )}
          </div>

          {/* Wishlist Button */}
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
        </Link>

        {/* Content */}
        <div className="p-4 text-right space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {product.rating || "5.0"}
              </span>
              <span className="text-[10px] text-slate-400">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Price & Add to Cart */}
      <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-3 flex items-center justify-between gap-2">
        <div className="text-right">
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-[11px] line-through text-slate-400">
              {formatPrice(product.originalPrice)}
            </p>
          )}
          <p className="text-sm font-black text-sky-600 dark:text-sky-400">
            {formatPrice(product.price)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-sky-600 dark:bg-slate-800 dark:hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          title="افزودن به سبد خرید"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>خرید</span>
        </button>
      </div>
    </div>
  );
}
