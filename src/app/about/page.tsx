import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Cpu,
  Code2,
  Palette,
  Video,
  Music2,
  Terminal,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره هکر امیر | برند شخصی و خالق دیجیتالیست",
  description:
    "زندگینامه، مهارت‌ها و اهداف هکر امیر در تلفیق مهندسی کامپیوتر، برنامه‌نویسی پایتون، تدوین و طراحی گرافیک با هنر اصیل نوازندگی ویولن.",
};

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 text-right">
        {/* Hero Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-sky-500/30 shadow-2xl">
              <Image
                src="/images/haker-amir.jpg"
                alt="هکر امیر"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 right-5 text-right">
                <p className="text-xl font-black text-white">هکر امیر (Haker Amir)</p>
                <p className="text-xs text-sky-400 font-mono">
                  DEVELOPER • CREATIVE DIRECTOR • VIOLINIST
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
              <Sparkles className="w-4 h-4" />
              <span>داستان خالق دیجیتالیست</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              تلفیق دنیای منطق سیلیکون و روح لطیف موسیقی
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              من امیر ملقب به «هکر امیر»، سال‌هاست در مسیر هم‌افزایی دو دنیایی گام برمی‌دارم که در ظاهر از هم جدا به نظر می‌رسند: دنیای دقیق، ساختاریافته و بی‌رحم برنامه‌نویسی و سخت‌افزار، در کنار جهان لطیف، پرشور و احساسی نوازندگی ویولن کلاسیک.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              دیجیتالیست ثمره سال‌ها تجربه در مونتاژ سیستم‌های پردازشی سنگین، تدوین تیزرهای تبلیغاتی، برنامه‌نویسی پایتون و آموزش نوازندگی متد سوزوکی است. هدف من ساخت محیطی است که هر علاقمندی بتواند ابزار فنی باکیفیت و دانش روز را در بستری تمیز، سریع و بدون اتلاف وقت دریافت کند.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <span>دوره‌های آموزشی امیر</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                ارتباط مستقیم
              </Link>
            </div>
          </div>
        </div>

        {/* 8 Areas of Mastery */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              حوزه‌های تخصصی و فعالیت‌های کلیدی
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              تسلط و تدریس هکر امیر در زمینه‌های دیجیتال و هنر
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "کامپیوتر و سخت‌افزار",
                desc: "مشاوره، اسمبل تخصصی کیس‌های رندرینگ، تست پایداری و بنچمارک قطعات نو.",
                icon: Cpu,
              },
              {
                title: "برنامه‌نویسی و توسعه وب",
                desc: "معماری نرم‌افزار، توسعه سیستم‌های مقیاس‌پذیر مدرن و کدنویسی ساختاریافته.",
                icon: Code2,
              },
              {
                title: "طراحی و هویت بصری",
                desc: "خلق استایل‌های مینیمال و پرمیوم برای برندهای نوین با روانشناسی بصری قوی.",
                icon: Palette,
              },
              {
                title: "آموزش و منتورینگ",
                desc: "انتقال مفاهیم پیچیده به زبانی روان، پروژه‌محور و کاملاً کاربردی برای بازار کار.",
                icon: BookOpen,
              },
              {
                title: "ادوبی فتوشاپ",
                desc: "فتومونتاژ پیشرفته، ادغام هوش مصنوعی Firefly، اصلاح نور و طراحی پوستر.",
                icon: Palette,
              },
              {
                title: "ادوبی پریمیر پرو",
                desc: "تدوین داینامیک، کالرگریدینگ سینمایی با پلاگین‌های مدرن و طراحی صدا.",
                icon: Video,
              },
              {
                title: "برنامه‌نویسی Python",
                desc: "ساخت اسکریپت‌های اتومیشن، هک قانونمند و تحلیل ساختار داده‌های شبکه.",
                icon: Terminal,
              },
              {
                title: "نوازندگی ویولن",
                desc: "تسلط بر متد بین‌المللی سوزوکی (جلد ۱ تا ۳)، تکنیک‌های آرشه‌کشی و رگلاژ ساز.",
                icon: Music2,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-sky-500/40 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Philosophy */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-lg font-black text-sky-400">
            فلسفه برند «دیجیتالیست»
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            ما باور داریم که ابزار خوب به خلاقیت انسان پر و بال می‌دهد. چه یک سیستم پردازشی با کارت گرافیک RTX 4090 باشد که ثانیه‌های گران‌بهای یک انیماتور را ذخیره کند، چه یک ویولن کرمونا که نوای دلنشینش انگیزه تمرین هر روزه هنرجو شود. در دیجیتالیست، هیچ محصولی بدون تست و تایید شخصی هکر امیر عرضه نمی‌گردد.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> قطعات ۱۰۰٪ نو و آکبند
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <CheckCircle2 className="w-4 h-4" /> رگلاژ و بازرسی فنی سازها
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <CheckCircle2 className="w-4 h-4" /> پشتیبانی مستقیم آموزشی
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
