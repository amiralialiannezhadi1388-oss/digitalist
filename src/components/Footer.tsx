import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import {
  Send,
  Mail,
  Phone,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  ShieldCheck,
  Zap,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 transition-colors relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/60">
          {/* Column 1: Brand & Slogan */}
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-slate-300 font-medium leading-relaxed mt-3">
              «تکنولوژی، آموزش و خلاقیت؛ در یک تجربه دیجیتال.»
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              پلتفرم انحصاری هکر امیر برای ارائه قدرتمندترین سیستم‌های رایانه‌ای نو، سازهای تخصصی ویولن و دوره‌های پیشرفته برنامه‌نویسی و هنر دیجیتال.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-sky-400">
                <Zap className="w-3.5 h-3.5" /> عملکرد سریع
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5 text-xs text-sky-400">
                <ShieldCheck className="w-3.5 h-3.5" /> تضمین اصالت
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                  <span>فروشگاه محصولات نو</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>دوره‌های آموزشی تخصصی</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/game"
                  className="hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>بازی دوبعدی Digitalist Runner</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <span>درباره و بیوگرافی هکر امیر</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-sky-400 transition-colors flex items-center gap-2"
                >
                  <span>سوالات متداول (FAQ)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">دسته‌بندی‌های برگزیده</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/shop?category=computer"
                  className="hover:text-sky-400 transition-colors"
                >
                  کیس‌های آماده گیمینگ و رندرینگ
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=laptop"
                  className="hover:text-sky-400 transition-colors"
                >
                  لپ‌تاپ‌های مهندسی و گیمینگ
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=violin"
                  className="hover:text-sky-400 transition-colors"
                >
                  ویولن‌های مستر و آکوستیک استاندارد
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=python"
                  className="hover:text-sky-400 transition-colors"
                >
                  دوره پایتون و امنیت
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=violin"
                  className="hover:text-sky-400 transition-colors"
                >
                  آموزش متد سوزوکی ویولن
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">تماس و شبکه‌های اجتماعی</h4>
            <div className="space-y-2.5 text-xs">
              {/* Phone */}
              <a
                href="tel:09308625900"
                className="flex items-center gap-2.5 text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span dir="ltr" className="font-mono text-sm">09308625900</span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/Violinist_Amir"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>کانال تلگرام:</span>
                </div>
                <span className="font-bold text-sky-400">Violinist🎻🎵</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/amirgraph"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-300 hover:text-pink-400 transition-colors p-2 rounded-xl bg-slate-900 border border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <InstagramIcon className="w-4 h-4 text-pink-400" />
                  <span>اینستاگرام:</span>
                </div>
                <span className="font-mono text-pink-400">@amirgraph</span>
              </a>

              {/* Email */}
              <a
                href="mailto:1388amiralian@gmail.com"
                className="flex items-center gap-2.5 text-slate-300 hover:text-sky-400 transition-colors p-2 rounded-xl bg-slate-900 border border-slate-800 truncate"
              >
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span dir="ltr" className="font-mono text-[11px] truncate">
                  1388amiralian@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© ۲۰۲۶ تمامی حقوق مادی و معنوی متعلق به «دیجیتالیست» و «هکر امیر» است.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              حریم خصوصی
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              قوانین خرید
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              پشتیبانی
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
