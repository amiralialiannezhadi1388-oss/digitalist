"use client";

import React, { useState } from "react";
import {
  Phone,
  Send,
  Mail,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function ContactPage() {
  const { showToast } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        setSentSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        showToast("پیام شما با موفقیت ارسال شد و به دست هکر امیر رسید.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-right">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <MessageSquare className="w-4 h-4" />
            <span>راه‌های ارتباطی مستقیم</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            تماس با هکر امیر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            برای مشاوره خرید سیستم‌های کامپیوتری، انتخاب ساز مناسب، ثبت‌نام دوره‌های آموزشی یا پروژه‌های نرم‌افزاری و طراحی می‌توانید از روش‌های زیر ارتباط برقرار نمایید.
          </p>
        </div>

        {/* 4 Official Contact Methods Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phone */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">تماس تلفنی</h3>
              <p className="text-xs text-slate-400">پاسخگویی ساعات کاری و سفارشات</p>
            </div>
            <a
              href="tel:09308625900"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-sky-500 dark:bg-slate-800 dark:hover:bg-sky-600 hover:text-white text-slate-900 dark:text-white text-xs font-mono font-bold transition-colors flex items-center justify-between"
              dir="ltr"
            >
              <span>09308625900</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Telegram */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">تلگرام هکر امیر</h3>
              <p className="text-xs text-slate-400">کانال و ارتباط مستقیم در تلگرام</p>
            </div>
            <a
              href="https://t.me/Violinist_Amir"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span>Violinist🎻🎵</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Instagram */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">صفحه اینستاگرام</h3>
              <p className="text-xs text-slate-400">آرت‌ورک‌ها، ویدیوهای ویولن و آموزش</p>
            </div>
            <a
              href="https://instagram.com/amirgraph"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500 text-pink-600 dark:text-pink-400 hover:text-white text-xs font-mono font-bold transition-colors flex items-center justify-between"
              dir="ltr"
            >
              <span>@amirgraph</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Email */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">پست الکترونیکی</h3>
              <p className="text-xs text-slate-400">مکاتبات تجاری و پشتیبانی رسمی</p>
            </div>
            <a
              href="mailto:1388amiralian@gmail.com"
              className="w-full py-2.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white text-[11px] font-mono font-bold transition-colors flex items-center justify-between truncate"
              dir="ltr"
            >
              <span className="truncate">1388amiralian@gmail.com</span>
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              فرم ارسال پیام مستقیم به هکر امیر
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              پیام شما مستقیماً در پنل مدیریت دریافت و در اسرع وقت پاسخ داده خواهد شد.
            </p>
          </div>

          {sentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>پیام شما با موفقیت ارسال شد. به زودی از طریق ایمیل یا شماره تماس با شما در ارتباط خواهیم بود.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: پارسا نوری"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  آدرس ایمیل *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09120000000"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  موضوع پیام
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مشاوره خرید، دوره آموزشی، همکاری..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                متن پیام شما *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="توضیحات و پیام خود را اینجا بنویسید..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "در حال ارسال..." : "ارسال پیام"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
