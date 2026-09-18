import React from "react";

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-right">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          قوانین خرید و ضمانت دیجیتالیست
        </h1>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed shadow-sm">
          <p>
            ۱. کلیه کالاهای کامپیوتری و قطعات دیجیتال عرضه شده در دیجیتالیست آکبند، نو و دارای گارانتی رسمی می‌باشند.
          </p>
          <p>
            ۲. سازهای ویولن پیش از بسته‌بندی توسط هکر امیر رگلاژ، کنترل کیفی و کوک اولیه می‌گردند و خریدار ۷ روز مهلت تست فنی سلامت ساز را دارد.
          </p>
          <p>
            ۳. دوره‌های آموزشی خریداری شده بلافاصله در حساب کاربری فعال شده و به صورت دائمی در دسترس خواهند بود.
          </p>
        </div>
      </div>
    </div>
  );
}
