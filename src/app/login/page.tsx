"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/Logo";
import { Lock, Mail, User, Phone, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, showToast } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fillCredentials = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("1388amiralian@gmail.com");
      setPassword("Amir@Digitalist2026!");
      setMode("login");
      showToast("اطلاعات ورود ادمین هکر امیر پر شد.");
    } else {
      setEmail("user@digitalist.ir");
      setPassword("User@123456");
      setMode("login");
      showToast("اطلاعات ورود کاربر نمونه پر شد.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, name, phone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در احراز هویت");
      }

      await refreshUser();
      showToast(
        mode === "login"
          ? `خوش آمدید، ${data.user.name}`
          : "حساب کاربری شما با موفقیت ایجاد شد."
      );

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "خطایی رخ داد.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-2xl text-right space-y-6">
        <div className="text-center flex flex-col items-center space-y-2">
          <Logo size="lg" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            ورود و ثبت‌نام در سامانه یکپارچه دیجیتالیست
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === "login"
                ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            ورود به حساب
          </button>
          <button
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              mode === "register"
                ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            ثبت‌نام جدید
          </button>
        </div>

        {/* Quick Demo Logins Bar */}
        <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-2">
          <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>ورود سریع آزمایشی:</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("admin")}
              className="flex-1 py-1.5 px-2 rounded-lg bg-sky-600 text-white text-[11px] font-semibold hover:bg-sky-500 transition-colors shadow-sm"
            >
              👑 مدیر ارشد (هکر امیر)
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("user")}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-semibold hover:bg-slate-700 transition-colors"
            >
              👤 کاربر عادی
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">نام و نام خانوادگی</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: کیان راد"
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">آدرس ایمیل</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
                className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
              />
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-xs text-slate-600 dark:text-slate-400">شماره موبایل (اختیاری)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09120000000"
                  dir="ltr"
                  className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-slate-600 dark:text-slate-400">کلمه عبور</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل ۶ کاراکتر"
                className="w-full pr-10 pl-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? "در حال پردازش..." : mode === "login" ? "ورود به دیجیتالیست" : "ایجاد حساب کاربری"}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
