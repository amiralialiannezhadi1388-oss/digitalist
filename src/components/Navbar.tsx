"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Logo from "@/components/Logo";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Gamepad2,
  BookOpen,
  ShoppingBag,
  ShieldAlert,
  LogOut,
  Sliders,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, cartCount, wishlist, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "خانه" },
    { href: "/shop", label: "فروشگاه" },
    { href: "/courses", label: "دوره‌ها" },
    { href: "/game", label: "بازی اختصاصی", badge: "2D" },
    { href: "/about", label: "درباره هکر امیر" },
    { href: "/contact", label: "تماس با من" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Right side: Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors py-1 ${
                      isActive
                        ? "text-sky-600 dark:text-sky-400 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-300"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="mr-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300 border border-sky-500/20">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left side (in RTL): Action buttons (Theme, Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              title="جستجو در محصولات و دوره‌ها"
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              title="علاقه‌مندی‌ها"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-[11px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              title="سبد خرید"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-[11px] font-bold bg-sky-500 text-white rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account dropdown / button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-slate-800 dark:text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-semibold max-w-[90px] truncate">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-right animate-in fade-in zoom-in-95"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      {user.role === "admin" && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          مدیر ارشد / Host
                        </span>
                      )}
                    </div>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>پنل مدیریت صاحب سایت</span>
                      </Link>
                    )}

                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-sky-500" />
                      <span>حساب کاربری من</span>
                    </Link>

                    <Link
                      href="/account?tab=courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-sky-500" />
                      <span>دوره‌های خریداری‌شده</span>
                    </Link>

                    <Link
                      href="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-sky-500" />
                      <span>تاریخچه سفارش‌ها</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors mt-1 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-400/20 dark:text-sky-300 border border-sky-500/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>ورود به پنل مدیریت صاحب سایت</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute right-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سیستم، ویولن، قطعات، دوره‌ها..."
                autoFocus
                className="w-full pr-11 pl-20 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 text-sm"
              />
              <button
                type="submit"
                className="absolute left-2 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors"
              >
                جستجو
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-1 border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <div className="flex gap-2">
                <span>پیشنهادات:</span>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/shop?search=گیمینگ");
                    setSearchOpen(false);
                  }}
                  className="text-sky-500 hover:underline"
                >
                  گیمینگ
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/shop?search=ویولن");
                    setSearchOpen(false);
                  }}
                  className="text-sky-500 hover:underline"
                >
                  ویولن استرادیواری
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    router.push("/courses?search=پایتون");
                    setSearchOpen(false);
                  }}
                  className="text-sky-500 hover:underline"
                >
                  دوره پایتون
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="hover:text-slate-200"
              >
                بستن (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
