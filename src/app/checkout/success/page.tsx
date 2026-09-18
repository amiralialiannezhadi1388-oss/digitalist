"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, BookOpen, ShoppingBag, ArrowLeft, Home } from "lucide-react";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderNumber?: string;
    trackingCode?: string;
    orderId?: string;
  }>;
}) {
  const { orderNumber, trackingCode, orderId } = use(searchParams);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            پرداخت با موفقیت انجام شد!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            سفارش شما در دیجیتالیست با موفقیت به ثبت رسید و تایید شد.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-right">
          <div className="flex justify-between">
            <span className="text-slate-400">شماره سفارش:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {orderNumber || "DIG-10492"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">کد رهگیری بانکی:</span>
            <span className="font-mono font-bold text-emerald-500">
              {trackingCode || "TRK-9824128"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">وضعیت سفارش:</span>
            <span className="font-bold text-sky-500">پرداخت شده و در حال پردازش</span>
          </div>
        </div>

        {/* Note on Course Access */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-right space-y-1">
          <p className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>دسترسی به دوره‌های آموزشی:</span>
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            اگر دوره آموزشی خریداری کرده‌اید، دوره‌ها بلافاصله در بخش «دوره‌های من» در پنل کاربری شما باز شده‌اند.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/account?tab=courses"
            className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>مشاهده دوره‌های من</span>
          </Link>

          <Link
            href="/"
            className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
