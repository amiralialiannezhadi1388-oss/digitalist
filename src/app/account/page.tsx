"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  User,
  BookOpen,
  ShoppingBag,
  Bell,
  Lock,
  Phone,
  Mail,
  ShieldAlert,
  LogOut,
  Play,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const router = useRouter();
  const { user, logout, showToast, refreshUser } = useApp();
  const { tab } = use(searchParams);

  const [activeTab, setActiveTab] = useState<"profile" | "courses" | "orders" | "notifications">(
    (tab as any) || "profile"
  );

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Data states
  const [userCoursesList, setUserCoursesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as any);
    }
  }, [tab]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    async function loadAccountData() {
      try {
        const [cRes, oRes] = await Promise.all([
          fetch("/api/user/courses"),
          fetch("/api/orders"),
        ]);

        if (cRes.ok) {
          const cData = await cRes.json();
          setUserCoursesList(cData.courses || []);
        }

        if (oRes.ok) {
          const oData = await oRes.json();
          setOrdersList(oData.orders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingData(false);
      }
    }

    loadAccountData();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          password: newPassword || undefined,
        }),
      });

      if (res.ok) {
        await refreshUser();
        setNewPassword("");
        showToast("اطلاعات حساب کاربری با موفقیت به‌روزرسانی شد.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          ورود به حساب کاربری دیجیتالیست
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          برای مشاهده دوره‌ها و سفارشات، ابتدا وارد حساب کاربری خود شوید.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
        >
          صفحه ورود / ثبت‌نام
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Greeting Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              {user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  سلام، {user.name}
                </h1>
                {user.role === "admin" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    مدیر ارشد / Host
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>پنل ادمین</span>
              </Link>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: "profile", label: "اطلاعات کاربری", icon: User },
            { id: "courses", label: `دوره‌های من (${userCoursesList.length})`, icon: BookOpen },
            { id: "orders", label: `سفارش‌های من (${ordersList.length})`, icon: ShoppingBag },
            { id: "notifications", label: "اعلان‌ها و پیام‌ها", icon: Bell },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Profile Information Form */}
        {activeTab === "profile" && (
          <div className="max-w-2xl p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-right animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              ویرایش اطلاعات حساب
            </h3>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  ایمیل حساب (غیرقابل تغییر)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-400 font-mono"
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
                  placeholder="09123456789"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                />
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  تغییر کلمه عبور (اختیاری)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="در صورت تمایل به تغییر، رمز عبور جدید را وارد کنید"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {savingProfile ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Enrolled Courses */}
        {activeTab === "courses" && (
          <div className="space-y-4 text-right animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              دوره‌های ثبت‌نام شده شما
            </h3>

            {userCoursesList.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  شما هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید
                </p>
                <p className="text-xs text-slate-400">
                  دوره‌های فتوشاپ، پریمیر، پایتون یا ویولن هکر امیر را مشاهده و شروع به یادگیری فرمایید.
                </p>
                <Link
                  href="/courses"
                  className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs mt-2"
                >
                  مشاهده دوره‌های آموزشی
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCoursesList.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-slate-950">
                        <Image src={c.image} alt={c.title} fill className="object-cover" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                          فعال و در دسترس
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {c.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          مدرس: {c.instructor} • {c.durationHours} ساعت
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Link
                        href={`/courses/${c.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>ورود به کلاس و پخش ویدیوها</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Order History */}
        {activeTab === "orders" && (
          <div className="space-y-4 text-right animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              تاریخچه و وضعیت سفارش‌های شما
            </h3>

            {ordersList.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  سفارشی در تاریخچه شما ثبت نشده است
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  ورود به فروشگاه
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-sky-600 dark:text-sky-400">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            ord.status === "paid" || ord.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : ord.status === "pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-rose-500/10 text-rose-500"
                          }`}
                        >
                          {ord.status === "paid"
                            ? "پرداخت شده"
                            : ord.status === "completed"
                            ? "تحویل داده شده"
                            : ord.status === "processing"
                            ? "در حال بسته‌بندی"
                            : ord.status === "cancelled"
                            ? "لغو شده"
                            : "در انتظار پرداخت"}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400">مبلغ کل:</span>
                        <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                          {formatPrice(ord.totalPrice)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">کد رهگیری:</span>
                        <span className="font-mono text-emerald-500 mr-1.5">
                          {ord.paymentTrackingCode || "---"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">تحویل به:</span>
                        <span className="text-slate-700 dark:text-slate-300 mr-1.5 truncate">
                          {ord.customerName} ({ord.customerPhone})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === "notifications" && (
          <div className="space-y-4 text-right animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              اعلان‌ها و رویدادهای دیجیتالیست
            </h3>

            <div className="space-y-3">
              {[
                {
                  title: "به وب‌سایت رسمی دیجیتالیست خوش آمدید",
                  desc: "پلتفرم اختصاصی هکر امیر در زمینه تکنولوژی، قطعات نو، سازهای اصیل و آکادمی آموزشی آماده خدمت‌رسانی به شماست.",
                  date: "امروز",
                  type: "welcome",
                },
                {
                  title: "جشنواره افتتاحیه با ۲۵٪ تخفیف",
                  desc: "کلیه دوره‌های آموزشی تخصصی فتوشاپ، پریمیر، پایتون و ویولن سوزوکی هم‌اکنون با تخفیف ویژه در دسترس هستند.",
                  date: "به تازگی",
                  type: "discount",
                },
                {
                  title: "رکوردگیری بازی دیجیتالیست رانر",
                  desc: "در پلتفرمر ۲ بعدی ما شرکت کنید، سکه‌ها را جمع‌آوری کنید و نام خود را در تابلوی مشاهیر ثبت نمایید.",
                  date: "فعال",
                  type: "game",
                },
              ].map((notif, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-sky-500 font-medium">{notif.date}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
