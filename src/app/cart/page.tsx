"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useApp();

  const hasPhysical = cart.some((i) => i.type === "product");
  const shippingCost = hasPhysical ? 65000 : 0;
  const finalTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          سبد خرید شما خالی است
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          محصولات سخت‌افزاری، سازهای ویولن و دوره‌های آموزشی دیجیتالیست را بررسی و به سبد اضافه کنید.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            مشاهده فروشگاه
          </Link>
          <Link
            href="/courses"
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            مشاهده دوره‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-right flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              سبد خرید من
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {cart.length} ردیف کالا در سبد خرید شماست
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium"
          >
            پاک کردن تمام سبد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto text-right">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      {item.type === "course" ? "دوره آموزشی" : "کالای فیزیکی"}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs font-black text-sky-600 dark:text-sky-400">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  {item.type === "product" ? (
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 bg-slate-50 dark:bg-slate-950">
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                        className="p-1 text-slate-700 dark:text-slate-300 hover:text-sky-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                        className="p-1 text-slate-700 dark:text-slate-300 hover:text-rose-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">۱ دوره دیجیتال</span>
                  )}

                  <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white min-w-[100px] text-left">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="حذف از سبد"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-right sticky top-28">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              خلاصه صورت‌حساب
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>مجموع ارزش کالاها:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {hasPhysical && (
                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و ارسال پیشتاز:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatPrice(shippingCost)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-emerald-500 font-medium">
                <span>تخفیف مستقیم:</span>
                <span>محاسبه شده روی قیمت</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  مبلغ نهایی قابل پرداخت:
                </span>
                <span className="text-lg font-black text-sky-600 dark:text-sky-400">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>ادامه فرایند خرید و ثبت مشخصات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>پرداخت امن و تضمین برگشت وجه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
