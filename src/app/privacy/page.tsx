import React from "react";

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-right">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          حریم خصوصی کاربران دیجیتالیست
        </h1>
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed shadow-sm">
          <p>
            حریم خصوصی شما برای برند دیجیتالیست و هکر امیر از بالاترین اهمیت برخوردار است. اطلاعات شخصی شما از قبیل آدرس ایمیل، شماره تماس و نشانی پستی صرفاً جهت پردازش سفارشات، ارسال کالاها و فعال‌سازی دوره‌های آموزشی استفاده می‌شود و تحت هیچ شرایطی در اختیار شخص ثالث قرار نمی‌گیرد.
          </p>
          <p>
            اطلاعات بانکی، رمزهای کارت و شماره‌های کارت در بستر امن درگاه شاپرک مبادله می‌شوند و سایت دیجیتالیست هیچ‌گونه دسترسی به اطلاعات محرمانه بانکی ندارد.
          </p>
        </div>
      </div>
    </div>
  );
}
