"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  ShieldAlert,
  ShoppingBag,
  BookOpen,
  Users,
  Settings,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  Video,
  FileText,
  RefreshCw,
  Search,
  ExternalLink,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "courses" | "orders" | "users" | "settings"
  >("overview");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [siteSettingsMap, setSiteSettingsMap] = useState<Record<string, string>>({});

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [sessionModalCourse, setSessionModalCourse] = useState<any | null>(null);

  // New Session form
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  const [sessionVideoUrl, setSessionVideoUrl] = useState("");
  const [sessionPdfUrl, setSessionPdfUrl] = useState("");
  const [sessionIsFree, setSessionIsFree] = useState(false);

  // Fetch all admin data
  const loadAdminData = async () => {
    try {
      const [sRes, pRes, cRes, oRes, uRes, setRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/products"),
        fetch("/api/courses"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/users"),
        fetch("/api/admin/settings"),
      ]);

      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData.stats);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProductsList(pData.products || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCoursesList(cData.courses || []);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrdersList(oData.orders || []);
      }
      if (uRes.ok) {
        const uData = await uRes.json();
        setUsersList(uData.users || []);
      }
      if (setRes.ok) {
        const setData = await setRes.json();
        setSiteSettingsMap(setData.settings || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? "/api/products" : `/api/products/${editingProduct.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        showToast(isNew ? "محصول جدید اضافه شد." : "تغییرات محصول با موفقیت ذخیره شد.");
        setEditingProduct(null);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("محصول حذف شد.");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Course (Create or Update)
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      const isNew = !editingCourse.id;
      const url = isNew ? "/api/courses" : `/api/courses/${editingCourse.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCourse),
      });

      if (res.ok) {
        showToast(isNew ? "دوره جدید اضافه شد." : "تغییرات دوره با موفقیت ذخیره شد.");
        setEditingCourse(null);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: number) => {
    if (!confirm("آیا از حذف این دوره اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("دوره حذف شد.");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Session to Course
  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionModalCourse) return;

    try {
      const res = await fetch(`/api/courses/${sessionModalCourse.id}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle,
          duration: sessionDuration,
          videoUrl: sessionVideoUrl,
          pdfUrl: sessionPdfUrl,
          isFreePreview: sessionIsFree,
        }),
      });

      if (res.ok) {
        showToast("جلسه جدید به دوره اضافه شد.");
        setSessionModalCourse(null);
        setSessionTitle("");
        setSessionDuration("");
        setSessionVideoUrl("");
        setSessionPdfUrl("");
        setSessionIsFree(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) {
        showToast("وضعیت سفارش تغییر یافت.");
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettingsMap),
      });
      if (res.ok) {
        showToast("تنظیمات و محتوای سایت با موفقیت ذخیره شد.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Security Check: Non-admins blocked
  if (!loading && (!user || user.role !== "admin")) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          دسترسی غیرمجاز
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          این پنل منحصراً برای صاحب برند (هکر امیر) در دسترس است. اگر مدیر هستید لطفاً با حساب کاربری هکر امیر وارد شوید.
        </p>
        <Link
          href="/login"
          className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
        >
          ورود با حساب مدیر ارشد
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-right">
        {/* Panel Header */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">پنل مدیریت اختصاصی صاحب برند (Host / Admin)</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  هکر امیر
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مدیریت کل وب‌سایت دیجیتالیست، قیمت‌ها، محصولات، دوره‌ها، سفارش‌ها و تنظیمات
              </p>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs"
            title="به‌روزرسانی اطلاعات"
          >
            <RefreshCw className="w-4 h-4" />
            <span>بروزرسانی داده‌ها</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "آمار و درآمد", icon: TrendingUp },
            { id: "products", label: `محصولات (${productsList.length})`, icon: ShoppingBag },
            { id: "courses", label: `دوره‌ها (${coursesList.length})`, icon: BookOpen },
            { id: "orders", label: `سفارشات (${ordersList.length})`, icon: ShoppingBag },
            { id: "users", label: `کاربران (${usersList.length})`, icon: Users },
            { id: "settings", label: "محتوا و تنظیمات سایت", icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isSel = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSel
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6 animate-in fade-in">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-400 font-bold">مجموع فروش و درآمد:</span>
                <p className="text-xl font-black text-emerald-500">{formatPrice(stats.totalSales)}</p>
                <p className="text-[10px] text-slate-400">تراکنش‌های تایید شده بانکی</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-400 font-bold">تعداد کل سفارشات:</span>
                <p className="text-xl font-black text-sky-500">{stats.totalOrders}</p>
                <p className="text-[10px] text-slate-400">سفارشات فیزیکی و دیجیتال</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-400 font-bold">کاربران ثبت‌نام شده:</span>
                <p className="text-xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
                <p className="text-[10px] text-slate-400">اعضای رسمی دیجیتالیست</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
                <span className="text-[11px] text-slate-400 font-bold">محصولات و دوره‌ها:</span>
                <p className="text-xl font-black text-amber-500">
                  {stats.totalProducts + stats.totalCourses}
                </p>
                <p className="text-[10px] text-slate-400">
                  {stats.totalProducts} کالا و {stats.totalCourses} مسترکلاس
                </p>
              </div>
            </div>

            {/* Quick Pricing note */}
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-700 dark:text-slate-300">
              💡 <strong>نکته مهم مدیریت:</strong> تمام قیمت‌های نمایش داده شده در وب‌سایت مستقیماً از بخش «محصولات» و «دوره‌ها» در همین پنل کنترل و ویرایش می‌شوند و به صورت بلادرنگ برای خریداران اعمال می‌گردند.
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                فهرست و ویرایش قیمت محصولات فروشگاه
              </h3>

              <button
                onClick={() =>
                  setEditingProduct({
                    name: "",
                    category: "computer",
                    categoryName: "کامپیوتر کامل",
                    price: 25000000,
                    originalPrice: 28000000,
                    discountPercent: 10,
                    stock: 5,
                    image: "https://images.pexels.com/photos/11047223/pexels-photo-11047223.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                    description: "",
                    shortDescription: "",
                    isFeatured: true,
                    isNew: true,
                  })
                }
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن محصول جدید</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      <th className="p-3">تصویر</th>
                      <th className="p-3">نام محصول</th>
                      <th className="p-3">دسته‌بندی</th>
                      <th className="p-3">قیمت فعلی (تومان)</th>
                      <th className="p-3">موجودی</th>
                      <th className="p-3">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3">
                          <img
                            src={prod.image}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg"
                          />
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                          {prod.name}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          {prod.categoryName}
                        </td>
                        <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                          {formatPrice(prod.price)}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.stock > 0
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-rose-500/10 text-rose-500"
                            }`}
                          >
                            {prod.stock} عدد
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10"
                              title="ویرایش قیمت و مشخصات"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                              title="حذف محصول"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COURSES MANAGEMENT */}
        {activeTab === "courses" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                مدیریت دوره‌های آموزشی، سرفصل‌ها و قیمت‌ها
              </h3>

              <button
                onClick={() =>
                  setEditingCourse({
                    title: "",
                    category: "python",
                    instructor: "هکر امیر",
                    price: 2000000,
                    originalPrice: 2500000,
                    discountPercent: 20,
                    image: "https://images.pexels.com/photos/37848029/pexels-photo-37848029.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                    previewVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                    description: "",
                    shortDescription: "",
                    durationHours: 20,
                    sessionsCount: 15,
                  })
                }
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن دوره جدید</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coursesList.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={course.image}
                      alt=""
                      className="w-16 h-12 object-cover rounded-xl"
                    />
                    <div className="flex-1 truncate">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-500">
                        {course.category}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate mt-1">
                        {course.title}
                      </h4>
                      <p className="text-[11px] font-bold text-sky-500 mt-0.5">
                        {formatPrice(course.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <button
                      onClick={() => setSessionModalCourse(course)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن جلسه ویدئویی / PDF</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10"
                        title="ویرایش قیمت و توضیحات"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        title="حذف دوره"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              مدیریت و پیگیری سفارشات خریداران
            </h3>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      <th className="p-3">شماره سفارش</th>
                      <th className="p-3">خریدار</th>
                      <th className="p-3">تماس / ایمیل</th>
                      <th className="p-3">مبلغ کل</th>
                      <th className="p-3">کد رهگیری</th>
                      <th className="p-3">وضعیت فعلی</th>
                      <th className="p-3">تغییر وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {ordersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-sky-500">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                          {ord.customerName}
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          <div>{ord.customerPhone}</div>
                          <div className="text-[10px]">{ord.customerEmail}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {formatPrice(ord.totalPrice)}
                        </td>
                        <td className="p-3 font-mono text-emerald-500">
                          {ord.paymentTrackingCode || "---"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.status === "paid" || ord.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : ord.status === "processing"
                                ? "bg-sky-500/10 text-sky-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="px-2 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          >
                            <option value="pending">pending (معلق)</option>
                            <option value="paid">paid (پرداخت شده)</option>
                            <option value="processing">processing (در حال ارسال)</option>
                            <option value="completed">completed (تکمیل شده)</option>
                            <option value="cancelled">cancelled (لغو شده)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              کاربران ثبت‌نام شده و سطوح دسترسی
            </h3>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
                      <th className="p-3">نام کاربر</th>
                      <th className="p-3">ایمیل</th>
                      <th className="p-3">تلفن</th>
                      <th className="p-3">نقش دسترسی</th>
                      <th className="p-3">تاریخ ثبت‌نام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                          {u.email}
                        </td>
                        <td className="p-3 text-slate-500 font-mono">
                          {u.phone || "ثبت نشده"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "admin"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {u.role === "admin" ? "مدیر ارشد (Host)" : "کاربر عادی"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SITE SETTINGS & CONTENT */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in text-right"
          >
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              ویرایش محتوای متنی و تنظیمات سایت
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">نام برند</label>
                <input
                  type="text"
                  value={siteSettingsMap.brand_name || "دیجیتالیست"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, brand_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">نام صاحب برند</label>
                <input
                  type="text"
                  value={siteSettingsMap.owner_name || "هکر امیر"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, owner_name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">شعار برند (Slogan)</label>
                <input
                  type="text"
                  value={
                    siteSettingsMap.slogan ||
                    "تکنولوژی، آموزش و خلاقیت؛ در یک تجربه دیجیتال."
                  }
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, slogan: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">تیتر زیرین هدر (Hero Subtitle)</label>
                <input
                  type="text"
                  value={
                    siteSettingsMap.hero_subtitle ||
                    "با هکر امیر، دنیای تکنولوژی، آموزش و موسیقی را تجربه کن."
                  }
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, hero_subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">متن معرفی هکر امیر (About Bio)</label>
                <textarea
                  rows={4}
                  value={siteSettingsMap.about_bio || ""}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, about_bio: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">شماره تلفن تماس</label>
                <input
                  type="text"
                  value={siteSettingsMap.phone || "09308625900"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">ایمیل پشتیبانی</label>
                <input
                  type="email"
                  value={siteSettingsMap.email || "1388amiralian@gmail.com"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">تلگرام هکر امیر</label>
                <input
                  type="text"
                  value={siteSettingsMap.telegram_title || "Violinist🎻🎵"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, telegram_title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">آیدی اینستاگرام</label>
                <input
                  type="text"
                  value={siteSettingsMap.instagram_title || "amirgraph"}
                  onChange={(e) =>
                    setSiteSettingsMap({ ...siteSettingsMap, instagram_title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تنظیمات سایت</span>
              </button>
            </div>
          </form>
        )}

        {/* MODAL: EDIT PRODUCT */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingProduct.id ? "ویرایش محصول" : "افزودن محصول جدید"}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">نام فارسی محصول *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">دسته‌بندی</label>
                    <select
                      value={editingProduct.category || "computer"}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const catNames: Record<string, string> = {
                          computer: "کامپیوتر کامل",
                          components: "قطعات کامپیوتر",
                          laptop: "لپ‌تاپ",
                          monitor: "مانیتور",
                          accessories: "لوازم جانبی",
                          gaming: "تجهیزات گیمینگ",
                          violin: "ویولن تخصصی",
                          violin_accessories: "لوازم ویولن",
                        };
                        setEditingProduct({
                          ...editingProduct,
                          category: cat,
                          categoryName: catNames[cat] || cat,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="computer">کامپیوتر کامل</option>
                      <option value="components">قطعات کامپیوتر</option>
                      <option value="laptop">لپ‌تاپ</option>
                      <option value="monitor">مانیتور</option>
                      <option value="accessories">لوازم جانبی</option>
                      <option value="gaming">تجهیزات گیمینگ</option>
                      <option value="violin">ویولن تخصصی</option>
                      <option value="violin_accessories">لوازم ویولن</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">موجودی انبار</label>
                    <input
                      type="number"
                      value={editingProduct.stock || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">قیمت فروش (تومان) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">قیمت اصلی (خط خورده)</label>
                    <input
                      type="number"
                      value={editingProduct.originalPrice || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          originalPrice: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">درصد تخفیف</label>
                    <input
                      type="number"
                      value={editingProduct.discountPercent || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discountPercent: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">آدرس تصویر محصول (URL)</label>
                  <input
                    type="text"
                    value={editingProduct.image || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">توضیحات کامل محصول</label>
                  <textarea
                    rows={4}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    ذخیره محصول
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT COURSE */}
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingCourse.id ? "ویرایش دوره آموزشی" : "افزودن دوره جدید"}
                </h3>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">عنوان دوره *</label>
                  <input
                    type="text"
                    required
                    value={editingCourse.title || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">دسته‌بندی دوره</label>
                    <select
                      value={editingCourse.category || "python"}
                      onChange={(e) =>
                        setEditingCourse({ ...editingCourse, category: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="photoshop">Photoshop (فتوشاپ)</option>
                      <option value="premiere">Premiere (پریمیر)</option>
                      <option value="python">Python (پایتون)</option>
                      <option value="violin">Violin (ویولن متد سوزوکی)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">مدرس دوره</label>
                    <input
                      type="text"
                      value={editingCourse.instructor || "هکر امیر"}
                      onChange={(e) =>
                        setEditingCourse({ ...editingCourse, instructor: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">قیمت فروش دوره (تومان) *</label>
                    <input
                      type="number"
                      required
                      value={editingCourse.price || 0}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          price: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">قیمت اصلی قبل از تخفیف</label>
                    <input
                      type="number"
                      value={editingCourse.originalPrice || 0}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          originalPrice: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">آدرس تصویر کاور دوره</label>
                  <input
                    type="text"
                    value={editingCourse.image || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, image: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">ویدئو پیش‌نمایش دوره (Preview MP4)</label>
                  <input
                    type="text"
                    value={editingCourse.previewVideoUrl || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, previewVideoUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">توضیحات و معرفی کامل دوره</label>
                  <textarea
                    rows={4}
                    value={editingCourse.description || ""}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    ذخیره دوره
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD SESSION TO COURSE */}
        {sessionModalCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-right space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  افزودن جلسه به «{sessionModalCourse.title}»
                </h3>
                <button
                  onClick={() => setSessionModalCourse(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSession} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">عنوان جلسه *</label>
                  <input
                    type="text"
                    required
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="مثال: جلسه ۷: پیاده‌سازی افکت‌های صوتی"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">مدت زمان (دقیقه:ثانیه) *</label>
                  <input
                    type="text"
                    required
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    placeholder="25:40"
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">لینک فایل ویدیوی جلسه (MP4 URL)</label>
                  <input
                    type="text"
                    value={sessionVideoUrl}
                    onChange={(e) => setSessionVideoUrl(e.target.value)}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-500">لینک فایل پیوست یا PDF تمرینی</label>
                  <input
                    type="text"
                    value={sessionPdfUrl}
                    onChange={(e) => setSessionPdfUrl(e.target.value)}
                    placeholder="/materials/lesson.pdf"
                    dir="ltr"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-right"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="freePrev"
                    checked={sessionIsFree}
                    onChange={(e) => setSessionIsFree(e.target.checked)}
                    className="w-4 h-4 accent-sky-500 rounded"
                  />
                  <label htmlFor="freePrev" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                    این جلسه به عنوان پیش‌نمایش رایگان در دسترس همگان باشد
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSessionModalCourse(null)}
                    className="px-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    ثبت جلسه
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
