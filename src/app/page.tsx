import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, courses, siteSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  ArrowLeft,
  Cpu,
  Monitor,
  Laptop,
  Gamepad2,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Video,
  Music2,
  Palette,
  Terminal,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CourseCard from "@/components/CourseCard";

export const revalidate = 0; // dynamic

export default async function HomePage() {
  // Fetch featured products
  const featuredProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.id))
    .limit(6);

  // Fetch educational courses
  const allCourses = await db
    .select()
    .from(courses)
    .orderBy(desc(courses.id))
    .limit(4);

  // Fetch site settings
  const settingsRecords = await db.select().from(siteSettings);
  const settings: Record<string, string> = {};
  settingsRecords.forEach((s) => {
    settings[s.key] = s.value;
  });

  const slogan =
    settings.slogan || "تکنولوژی، آموزش و خلاقیت؛ در یک تجربه دیجیتال.";
  const heroSubtitle =
    settings.hero_subtitle ||
    "با هکر امیر، دنیای تکنولوژی، آموزش و موسیقی را تجربه کن.";
  const aboutBio =
    settings.about_bio ||
    "من هکر امیر هستم؛ متخصص فناوری، برنامه‌نویس، طراح خلاق، مدرس نرم‌افزارهای دیجیتال و نوازنده ویولن. هدف من در دیجیتالیست ساخت تجربه‌ای ممتاز برای علاقمندان به تکنولوژی و هنر است.";

  const computerProducts = featuredProducts.filter((p) =>
    ["computer", "components", "laptop", "monitor", "gaming", "accessories"].includes(
      p.category
    )
  );

  const violinProducts = featuredProducts.filter((p) =>
    ["violin", "violin_accessories"].includes(p.category)
  );

  return (
    <div className="w-full flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* 1. HERO SECTION */}
      <section className="relative w-full pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-digital-grid">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Right text content (RTL) */}
            <div className="lg:col-span-7 flex flex-col items-start text-right space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold backdrop-blur-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>برند شخصی هکر امیر • Haker Amir</span>
              </div>

              {/* Main Brand Title */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  دیجیتالیست
                  <span className="text-sky-500">.</span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-200 leading-snug">
                  {heroSubtitle}
                </p>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {slogan}
                </p>
              </div>

              {/* CTAs */}
              <div className="w-full flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/shop"
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <span>مشاهده فروشگاه</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <Link
                  href="/courses"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-sky-400" />
                  <span>شروع یادگیری</span>
                </Link>

                <Link
                  href="/game"
                  className="px-5 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <span>🎮 بازی اختصاصی</span>
                </Link>
              </div>

              {/* Feature mini chips */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80 w-full max-w-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Cpu className="w-4 h-4 text-sky-500" />
                    <span>سیستم‌های نو</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    قطعات آکبند با گارانتی
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Music2 className="w-4 h-4 text-sky-500" />
                    <span>ویولن اصیل</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    رگلاژ و تست تخصصی
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Code2 className="w-4 h-4 text-sky-500" />
                    <span>آموزش کاربردی</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    مستقیماً با هکر امیر
                  </p>
                </div>
              </div>
            </div>

            {/* Left Visual: Premium Tech & Music Hero Composite */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/digitalist-banner.jpg"
                  alt="دیجیتالیست هکر امیر"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Floating dynamic status badge */}
                <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        دیجیتالیست • نسخه ۲۰۲۶
                      </p>
                      <p className="text-[11px] text-slate-400">
                        سخت‌افزار، موسیقی و کدنویسی
                      </p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT HAKER AMIR (Personal Brand Showcase) */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Portrait Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden border-2 border-sky-500/30 shadow-2xl shadow-sky-500/5 group">
                <Image
                  src="/images/haker-amir.jpg"
                  alt="هکر امیر - Haker Amir"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 right-5 text-right">
                  <p className="text-lg font-black text-white">هکر امیر</p>
                  <p className="text-xs text-sky-400 font-mono">
                    HAKER AMIR • CREATOR & VIOLINIST
                  </p>
                </div>
              </div>
            </div>

            {/* Bio & Domains of Expertise */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>درباره صاحب برند</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                  معرفی هکر امیر
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {aboutBio}
              </p>

              {/* 8 Expertise Domains Mentioned in Prompt */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { title: "کامپیوتر", desc: "سخت‌افزار و اسمبل", icon: Cpu },
                  { title: "برنامه‌نویسی", desc: "وب و سیستم", icon: Code2 },
                  { title: "طراحی گرافیک", desc: "هویت بصری و UI", icon: Palette },
                  { title: "آموزش", desc: "تدریس پروژه‌محور", icon: BookOpen },
                  { title: "فتوشاپ", desc: "Photoshop 2026", icon: Palette },
                  { title: "پریمیر", desc: "تدوین ویدئو", icon: Video },
                  { title: "Python", desc: "اتومیشن و امنیت", icon: Terminal },
                  { title: "ویولن", desc: "متد سوزوکی و کلاسیک", icon: Music2 },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right space-y-1 hover:border-sky-500/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center mb-1">
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors"
                >
                  <span>مطالعه زندگینامه و داستان برند</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPUTER HARDWARE & SYSTEMS SHOWCASE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                <Cpu className="w-4 h-4" />
                <span>محصولات نو و آکبند</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                سیستم‌ها و قطعات کامپیوتر دیجیتالیست
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                برترین سخت‌افزارهای گیمینگ و ورک‌استیشن با گارانتی رسمی
              </p>
            </div>

            <Link
              href="/shop?category=computer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 self-start sm:self-auto"
            >
              <span>مشاهده همه محصولات کامپیوتر</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {computerProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VIOLIN & ACOUSTIC GEAR SHOWCASE */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-500">
                <Music2 className="w-4 h-4" />
                <span>سازهای دست‌چین و اصیل</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ویولن و تجهیزات نوازندگی
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                سازهای رگلاژ شده، آرشه‌های کربن فایبر و سیم‌های تخصصی با تایید هکر امیر
              </p>
            </div>

            <Link
              href="/shop?category=violin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 self-start sm:self-auto"
            >
              <span>مشاهده همه سازها و لوازم ویولن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {violinProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDUCATIONAL COURSES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                <BookOpen className="w-4 h-4" />
                <span>آکادمی دیجیتالیست</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                دوره‌های تخصصی و کاربردی
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                آموزش فتوشاپ، پریمیر، پایتون و متد بین‌المللی سوزوکی ویولن
              </p>
            </div>

            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 self-start sm:self-auto"
            >
              <span>مشاهده تمامی دوره‌ها</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. GAME TEASER BANNER (Digitalist Runner) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 p-8 sm:p-12 text-white shadow-2xl">
            {/* Background art */}
            <div className="absolute inset-0 opacity-25">
              <Image
                src="/images/game-banner.jpg"
                alt="Digitalist Runner Game"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 max-w-2xl text-right space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>بازی دوبعدی اختصاصی</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black">
                بازی دیجیتالیست رانر (Digitalist Runner)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                مهارت‌های پرش و فرار خود را در دنیای مدارهای سخت‌افزاری کامپیوتر، مادربرد و چیپست‌ها محک بزنید! امتیاز بگیرید و نام خود را در تابلوی رکوردهای برتر ثبت کنید.
              </p>
              <div className="pt-2">
                <Link
                  href="/game"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Gamepad2 className="w-4 h-4 fill-current" />
                  <span>🎮 اجرای آنلاین بازی</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION PREVIEW */}
      <section className="py-20 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              سوالات متداول کاربران
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              پاسخ به پرتکرارترین پرسش‌ها درباره سفارش‌ها، آموزش‌ها و سازها
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "آیا محصولات کامپیوتری و قطعات نو هستند؟",
                a: "بله، ۱۰۰٪ قطعات کامپیوتری، کیس‌ها، لپ‌تاپ‌ها و قطعات عرضه شده در دیجیتالیست آکبند و کاملاً نو بوده و به همراه گارانتی رسمی شرکت‌های معتبر ارسال می‌شوند.",
              },
              {
                q: "پس از خرید دوره، چگونه به ویدیوها و فایل‌ها دسترسی پیدا می‌کنم؟",
                a: "بلافاصله پس از تکمیل پرداخت، دوره خریداری‌شده در بخش «دوره‌های من» در حساب کاربری شما ظاهر می‌شود و می‌توانید جلسات ویدیویی و فایل‌های PDF را مستقیماً مشاهده نمایید.",
              },
              {
                q: "آیا سازهای ویولن پیش از ارسال رگلاژ و تست صدا می‌شوند؟",
                a: "بله، کلیه ویولن‌ها توسط هکر امیر بررسی صدایی، تنظیم خرک، گریف و گوشی‌ها و کوک دقیق شده و سپس در بسته‌بندی ایمن ارسال می‌گردند.",
              },
              {
                q: "روش‌های پرداخت و امنیت بانکی چگونه است؟",
                a: "معماری درگاه پرداخت آنلاین بانکی شبکه شتاب فراهم شده است و هیچ‌گونه اطلاعات حساس کارت در وب‌سایت ذخیره نمی‌شود.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <summary className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <span className="text-sky-500 group-open:rotate-90 transition-transform">
                    ‹
                  </span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800/80">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              مشاهده تمام سوالات متداول →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
