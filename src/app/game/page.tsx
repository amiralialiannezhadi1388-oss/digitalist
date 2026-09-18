import React from "react";
import DigitalistRunnerGame from "@/components/DigitalistRunnerGame";
import { Gamepad2, Sparkles, Trophy, Cpu, HardDrive, Smartphone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بازی اختصاصی دیجیتالیست رانر (Digitalist Runner) | هکر امیر",
  description:
    "پلتفرمر دو بعدی اختصاصی هکر امیر در دنیای سخت‌افزار، مادربردها، قطعات پردازشی و مدارهای سیلیکونی. بازی آنلاین با ثبت امتیاز در لیدربورد و پشتیبانی لمسی موبایل.",
};

export default function GamePage() {
  return (
    <div className="w-full min-h-screen py-10 bg-slate-950 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Game Interface */}
        <DigitalistRunnerGame />

        {/* Game Lore & Mechanics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right pt-6 border-t border-slate-800">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">داستان بازی</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              شما در نقش کاراکتر سایبری هکر امیر در درون مدارهای مجتمع یک ابررایانه حرکت می‌کنید. باید جریان الکتریکی را حفظ کرده و چیپ‌های اطلاعاتی را قبل از داغ‌شدن پردازنده جمع‌آوری کنید.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">آیتم‌ها و امتیازات</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              سکه‌های باینری ۵۰ امتیاز، حافظه‌های RAM ۱۲۰ امتیاز و تراشه‌های کریستالی ۲۵۰ امتیاز دارند. عبور از هر پورتال خروجی مرحله نیز ۵۰۰ امتیاز اضافه می‌کند!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">سازگاری با موبایل و دسکتاپ</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              در دسکتاپ با کلیدهای جهت‌نما و Space بازی کنید. در موبایل و تبلت دکمه‌های لمسی مخصوص روی صفحه فعال شده و بدون هیچ تاخیری اجرا می‌شوند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
