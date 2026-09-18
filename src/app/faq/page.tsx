import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronLeft, ShoppingBag, BookOpen, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سوالات متداول (FAQ) | دیجیتالیست",
  description:
    "پاسخ به سوالات متداول درباره خرید قطعات کامپیوتری نو، دوره‌های آموزشی هکر امیر، ارسال ویولن و درگاه پرداخت آنلاین بانکی.",
};

export default function FAQPage() {
  const faqs = [
    {
      category: "خرید و محصولات فیزیکی",
      icon: ShoppingBag,
      items: [
        {
          q: "آیا تمام محصولات کامپیوتری و قطعات فروشگاه نو هستند؟",
          a: "بله، ۱۰۰٪ محصولات سخت‌افزاری شامل کیس‌های گیمینگ، لپ‌تاپ‌ها، مانیتورها، کارت‌های گرافیک و لوازم جانبی آکبند و کاملاً نو بوده و با گارانتی رسمی عرضه می‌شوند.",
        },
        {
          q: "ارسال محصولات فیزیکی چقدر زمان می‌برد؟",
          a: "سفارشات تهران از طریق پیک اکسپرس ۲۴ ساعته و سفارشات سایر شهرستان‌ها از طریق پست پیشتاز یا تیپاکس ظرف ۲ الی ۳ روز کاری تحویل می‌گردند.",
        },
        {
          q: "بسته‌بندی سازهای ویولن چگونه انجام می‌شود؟",
          a: "تمامی ویولن‌ها داخل هاردکیس‌های استاندارد فوم ضربه‌گیر قرار گرفته و سپس با لایه‌های متعدد بابل‌رپ پلمپ می‌شوند تا در برابر هرگونه ضربه در فرایند حمل کاملاً محافظت شوند.",
        },
      ],
    },
    {
      category: "دوره‌های آموزشی و آکادمی",
      icon: BookOpen,
      items: [
        {
          q: "پس از پرداخت، چگونه به ویدیوهای دوره دسترسی پیدا می‌کنم؟",
          a: "بلافاصله پس از تکمیل تراکنش، دوره در بخش «دوره‌های من» در پنل کاربری شما فعال می‌شود و می‌توانید به صورت آنلاین جلسات را مشاهده و فایل‌های تمرینی را دانلود کنید.",
        },
        {
          q: "آیا دسترسی به دوره‌ها دارای محدودیت زمانی است؟",
          a: "خیر، دسترسی شما به دوره‌های خریداری شده دائمی و مادام‌العمر است و هر زمان که نیاز داشتید می‌توانید ویدئوها را مرور نمایید.",
        },
        {
          q: "آیا سرفصل‌های دوره فتوشاپ، پریمیر و پایتون برای بازار کار مناسب هستند؟",
          a: "بله، سرفصل‌ها بر پایه تجربیات عملی هکر امیر در پروژه‌های واقعی تدوین شده‌اند و تمرینات از سطح پایه تا انجام پروژه‌های حرفه‌ای بازار کار پیش می‌روند.",
        },
      ],
    },
    {
      category: "پرداخت و امور مالی",
      icon: ShieldCheck,
      items: [
        {
          q: "نحوه پرداخت در دیجیتالیست چگونه است؟",
          a: "پرداخت از طریق درگاه‌های پرداخت امن شاپرک با کلیه کارت‌های عضو شبکه شتاب امکان‌پذیر است. اطلاعات حساس بانکی هرگز در سایت ثبت نمی‌شوند.",
        },
        {
          q: "آیا قیمت‌های سایت به‌روز هستند؟",
          a: "بله، تمام قیمت‌ها به صورت بلادرنگ از پنل مدیریت کنترل شده و قیمتی که در لحظه پرداخت مشاهده می‌کنید قطعی است.",
        },
      ],
    },
    {
      category: "سازهای تخصصی ویولن",
      icon: Truck,
      items: [
        {
          q: "آیا ویولن‌ها رگلاژ شده ارسال می‌شوند؟",
          a: "بله، تمام سازهای ویولن پیش از ارسال توسط هکر امیر تست صدایی، تراش و تنظیم ارتفاع خرک، رگلاژ پل و کوک اولیه می‌گردند.",
        },
        {
          q: "برای هنرجوی مبتدی چه ویولنی پیشنهاد می‌کنید؟",
          a: "برای شروع متد سوزوکی، مدل یاماها V5 یا سازهای آموزشی رگلاژ شده ۴/۴ با آرشه کربن فایبر سبک بهترین بازدهی را دارند.",
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-right">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <HelpCircle className="w-4 h-4" />
            <span>مرکز راهنمایی و پشتیبانی</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            سوالات متداول کاربران دیجیتالیست
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            پرسش‌های پرتکرار در خصوص سفارش‌ها، دوره‌ها، گارانتی و شیوه ارسال
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((group, idx) => {
            const GroupIcon = group.icon;
            return (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                  <GroupIcon className="w-4 h-4 text-sky-500" />
                  <span>{group.category}</span>
                </div>

                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <details
                      key={i}
                      className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer shadow-sm"
                    >
                      <summary className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between list-none">
                        <span>{item.q}</span>
                        <ChevronLeft className="w-4 h-4 text-sky-500 transition-transform group-open:-rotate-90" />
                      </summary>
                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact fallback */}
        <div className="p-8 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            پاسخ سوال خود را پیدا نکردید؟
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            تیم پشتیبانی دیجیتالیست و هکر امیر آماده پاسخگویی به هرگونه سوال یا راهنمایی شما هستند.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              ارسال پیام به پشتیبانی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
