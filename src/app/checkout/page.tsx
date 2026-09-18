"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, user } = useApp();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [gateway, setGateway] = useState<"zarinpal" | "saman">("zarinpal");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasPhysical = cart.some((i) => i.type === "product");
  const shippingCost = hasPhysical ? 65000 : 0;
  const finalTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          سبد خرید شما خالی است
        </h2>
        <button
          onClick={() => router.push("/shop")}
          className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
        >
          بازگشت به فروشگاه
        </button>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !phone) {
      setErrorMsg("لطفاً نام، ایمیل و شماره تماس را وارد فرمایید.");
      return;
    }

    if (hasPhysical && !address) {
      setErrorMsg("لطفاً آدرس پستی جهت ارسال کالا را درج نمایید.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: hasPhysical ? address : "تحویل آنلاین در حساب کاربری",
          postalCode: postalCode || null,
          items: cart,
          paymentGateway: gateway,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت سفارش");
      }

      // Redirect to Bank Payment Gateway Simulation
      router.push(`/checkout/payment?orderId=${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || "خطایی رخ داد.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-10 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-right space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            تکمیل اطلاعات و پرداخت
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            لطفاً اطلاعات گیرنده را جهت ارسال سفارش یا فعال‌سازی دوره‌ها به دقت وارد فرمایید.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold text-right">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Delivery Form */}
          <div className="lg:col-span-7 space-y-6 text-right">
            {/* Personal Details */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-sky-500" />
                <span>مشخصات تحویل‌گیرنده</span>
              </h3>

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
                    placeholder="مثال: امیرعلی یوسفی"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    شماره موبایل *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    آدرس ایمیل (جهت فعال‌سازی دوره و ارسال فاکتور) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                  />
                </div>
              </div>
            </div>

            {/* Physical Delivery Address (if contains physical product) */}
            {hasPhysical && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm animate-in fade-in">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>نشانی پستی دریافت سفارش فیزیکی</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      آدرس کامل پستی *
                    </label>
                    <textarea
                      required={hasPhysical}
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک، زنگ..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      کد پستی ۱۰ رقمی
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="۱۲۳۴۵۶۷۸۹۰"
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 text-right"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Gateway Options */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-sky-500" />
                <span>انتخاب درگاه پرداخت آنلاین شاپرک</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setGateway("zarinpal")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    gateway === "zarinpal"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="text-right">
                    <p className="font-bold text-xs">درگاه پرداخت زرین‌پال</p>
                    <p className="text-[11px] text-slate-400">پشتیبانی از کلیه کارت‌های شتاب</p>
                  </div>
                  <input
                    type="radio"
                    name="gateway"
                    checked={gateway === "zarinpal"}
                    onChange={() => setGateway("zarinpal")}
                    className="accent-sky-500"
                  />
                </label>

                <label
                  onClick={() => setGateway("saman")}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    gateway === "saman"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <div className="text-right">
                    <p className="font-bold text-xs">درگاه پرداخت سپهر / سامان</p>
                    <p className="text-[11px] text-slate-400">اتصال مستقیم شاپرک</p>
                  </div>
                  <input
                    type="radio"
                    name="gateway"
                    checked={gateway === "saman"}
                    onChange={() => setGateway("saman")}
                    className="accent-sky-500"
                  />
                </label>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>اطلاعات کارت شما مستقیماً در درگاه امن شاپرک وارد می‌شود و هیچ اطلاعات حساسی در سرورهای سایت ذخیره نمی‌شود.</span>
              </div>
            </div>
          </div>

          {/* Order Summary & Submit Column */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-right sticky top-28">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              اقلام سفارش ({cart.length})
            </h3>

            {/* Items miniature list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex justify-between items-center text-xs">
                  <div className="text-right truncate max-w-[200px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity} عدد</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>ارزش کالاها:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(cartTotal)}</span>
              </div>
              {hasPhysical && (
                <div className="flex justify-between">
                  <span>هزینه ارسال:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatPrice(shippingCost)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">مبلغ نهایی:</span>
                <span className="text-lg font-black text-sky-600 dark:text-sky-400">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? "در حال اتصال به درگاه..." : "پرداخت و ثبت نهایی سفارش"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
