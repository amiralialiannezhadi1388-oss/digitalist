"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/utils";
import {
  CreditCard,
  Shield,
  Lock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function PaymentGatewaySimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const router = useRouter();
  const { clearCart, refreshUser } = useApp();
  const { orderId } = use(searchParams);

  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("6037-9918-");
  const [cvv2, setCvv2] = useState("742");
  const [expMonth, setExpMonth] = useState("08");
  const [expYear, setExpYear] = useState("06");
  const [dynamicPin, setDynamicPin] = useState("892341");

  useEffect(() => {
    if (!orderId) {
      router.push("/cart");
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        }
        setLoadingOrder(false);
      })
      .catch(() => setLoadingOrder(false));
  }, [orderId, router]);

  const handlePay = async (success: boolean) => {
    setProcessing(true);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, success }),
      });

      const data = await res.json();
      if (success && data.success) {
        clearCart();
        await refreshUser();
        router.push(
          `/checkout/success?orderNumber=${data.orderNumber}&trackingCode=${data.trackingCode}&orderId=${orderId}`
        );
      } else {
        router.push("/cart");
      }
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  if (loadingOrder) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <p className="text-sm text-slate-400">سفارش یافت نشد.</p>
        <button
          onClick={() => router.push("/cart")}
          className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs"
        >
          بازگشت به سبد خرید
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-10 bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-right">
        {/* Terminal Header */}
        <div className="p-6 bg-gradient-to-r from-sky-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">درگاه پرداخت اینترنتی شاپرک</p>
              <p className="text-[10px] text-sky-400">محیط تست امن دیجیتالیست (Zarinpal / Shaparak)</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            SSL 256-Bit
          </span>
        </div>

        {/* Payment Summary Box */}
        <div className="p-6 space-y-3 bg-slate-900/50 border-b border-slate-800/80 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">پذیرنده:</span>
            <span className="font-bold text-white">فروشگاه دیجیتالیست (هکر امیر)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">شماره سفارش:</span>
            <span className="font-mono text-sky-400">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
            <span className="text-slate-400">مبلغ قابل پرداخت:</span>
            <div>
              <span className="text-base font-black text-emerald-400">
                {formatPrice(order.totalPrice)}
              </span>
              <span className="text-[10px] text-slate-500 mr-1 font-mono">
                ({(order.totalPrice * 10).toLocaleString("fa-IR")} ریال)
              </span>
            </div>
          </div>
        </div>

        {/* Mock Card Input Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">شماره کارت ۱۶ رقمی شتاب</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="---- ---- ---- ----"
              dir="ltr"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-sky-500 text-center"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">کد CVV2</label>
              <input
                type="password"
                maxLength={4}
                value={cvv2}
                onChange={(e) => setCvv2(e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">تاریخ انقضا (ماه / سال)</label>
              <div className="flex gap-2" dir="ltr">
                <input
                  type="text"
                  maxLength={2}
                  value={expMonth}
                  onChange={(e) => setExpMonth(e.target.value)}
                  placeholder="MM"
                  className="w-1/2 px-2 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-sky-500"
                />
                <input
                  type="text"
                  maxLength={2}
                  value={expYear}
                  onChange={(e) => setExpYear(e.target.value)}
                  placeholder="YY"
                  className="w-1/2 px-2 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <label>رمز اینترنتی (پویا)</label>
              <span className="text-[10px] text-sky-400 font-bold cursor-pointer">درخواست رمز پویا</span>
            </div>
            <input
              type="password"
              value={dynamicPin}
              onChange={(e) => setDynamicPin(e.target.value)}
              placeholder="رمز پویا پیامک شده"
              dir="ltr"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-center focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            <button
              onClick={() => handlePay(true)}
              disabled={processing}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? "در حال پردازش تراکنش..." : "پرداخت و بازگشت به دیجیتالیست"}</span>
            </button>

            <button
              onClick={() => handlePay(false)}
              disabled={processing}
              className="w-full py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 text-xs font-semibold transition-colors"
            >
              انصراف از پرداخت و بازگشت به سبد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
