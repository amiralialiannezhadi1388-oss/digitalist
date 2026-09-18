"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";

interface ShopFiltersProps {
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}

export default function ShopFilters({
  currentCategory,
  currentSort,
  currentSearch,
}: ShopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(currentSearch || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get("minPrice") || "");
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get("maxPrice") || "");
  const [inStockChecked, setInStockChecked] = useState(searchParams.get("inStock") === "true");

  const categories = [
    { id: "all", label: "همه محصولات" },
    { id: "computer", label: "کامپیوتر" },
    { id: "components", label: "قطعات کامپیوتر" },
    { id: "laptop", label: "لپ‌تاپ" },
    { id: "monitor", label: "مانیتور" },
    { id: "accessories", label: "لوازم جانبی" },
    { id: "gaming", label: "تجهیزات گیمینگ" },
    { id: "violin", label: "ویولن" },
    { id: "violin_accessories", label: "لوازم ویولن" },
  ];

  const sortOptions = [
    { id: "newest", label: "جدیدترین" },
    { id: "cheapest", label: "ارزان‌ترین" },
    { id: "expensive", label: "گران‌ترین" },
    { id: "rating", label: "بیشترین امتیاز" },
  ];

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "" || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const applyAdvancedFilters = () => {
    updateFilters({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
      inStock: inStockChecked ? "true" : null,
    });
  };

  return (
    <div className="space-y-4">
      {/* Category Pills (horizontal scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected =
            (!currentCategory && cat.id === "all") || currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.id })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/50"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="جستجوی نام یا قطعه..."
            className="w-full pr-9 pl-16 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateFilters({ search: null });
              }}
              className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
          >
            بیاب
          </button>
        </form>

        {/* Sort & Advanced Trigger */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSort || "newest"}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle filter drawer */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              showAdvanced
                ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>فیلتر پیشرفته</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in duration-200 text-right">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Min Price */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                حداقل قیمت (تومان)
              </label>
              <input
                type="number"
                placeholder="مثال: ۵۰۰۰۰۰"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Max Price */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                حداکثر قیمت (تومان)
              </label>
              <input
                type="number"
                placeholder="مثال: ۵۰۰۰۰۰۰۰"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Stock checkbox */}
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="stockCheckbox"
                checked={inStockChecked}
                onChange={(e) => setInStockChecked(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
              <label
                htmlFor="stockCheckbox"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                فقط کالاهای موجود
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setMinPriceInput("");
                setMaxPriceInput("");
                setInStockChecked(false);
                updateFilters({ minPrice: null, maxPrice: null, inStock: null });
              }}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              پاکسازی فیلترها
            </button>

            <button
              onClick={applyAdvancedFilters}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-colors"
            >
              اعمال فیلتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
