import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "دیجیتالیست | برند شخصی هکر امیر",
  description:
    "وب‌سایت اختصاصی هکر امیر؛ فروشگاه پیشرفته سیستم‌های کامپیوتری نو، ویولن‌های تخصصی، دوره‌های آموزش برنامه‌نویسی و ادیت و بازی اختصاصی دیجیتالیست رانر.",
  keywords: [
    "دیجیتالیست",
    "هکر امیر",
    "سیستم گیمینگ",
    "آموزش پایتون",
    "آموزش فتوشاپ",
    "آموزش پریمیر",
    "آموزش ویولن سوزوکی",
    "خرید ویولن",
    "لپ‌تاپ گیمینگ",
  ],
  authors: [{ name: "هکر امیر" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-sky-500 selection:text-white transition-colors duration-200">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
