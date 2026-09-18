"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: number;
  type: "product" | "course";
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category?: string;
  slug: string;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  phone?: string | null;
  avatar?: string | null;
}

interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: number, type: "product" | "course") => void;
  updateQuantity: (id: number, type: "product" | "course", quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: { id: number; type: "product" | "course" }[];
  toggleWishlist: (id: number, type: "product" | "course") => void;
  isWishlisted: (id: number, type: "product" | "course") => boolean;
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<{ id: number; type: "product" | "course" }[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from LocalStorage and fetch current session
  useEffect(() => {
    // 1. Theme
    const savedTheme = localStorage.getItem("digitalist_theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. Cart
    try {
      const savedCart = localStorage.getItem("digitalist_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error(e);
    }

    // 3. Wishlist
    try {
      const savedWishlist = localStorage.getItem("digitalist_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error(e);
    }

    // 4. Fetch User Session
    refreshUser();

    // Auto seed check
    fetch("/api/seed").catch(() => {});
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (e) {
      console.error("Auth fetch failed:", e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("digitalist_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Cart actions
  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.type === item.type);
      let updated: CartItem[];
      if (existing) {
        // If course, course quantity stays 1
        if (item.type === "course") {
          showToast(`«${item.title}» در سبد خرید شما موجود است.`);
          return prev;
        }
        updated = prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        updated = [...prev, { ...item, quantity }];
      }
      localStorage.setItem("digitalist_cart", JSON.stringify(updated));
      showToast(`«${item.title}» به سبد خرید افزوده شد.`);
      return updated;
    });
  };

  const removeFromCart = (id: number, type: "product" | "course") => {
    setCart((prev) => {
      const updated = prev.filter((i) => !(i.id === id && i.type === type));
      localStorage.setItem("digitalist_cart", JSON.stringify(updated));
      showToast("آیتم از سبد خرید حذف شد.");
      return updated;
    });
  };

  const updateQuantity = (id: number, type: "product" | "course", quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((i) =>
        i.id === id && i.type === type ? { ...i, quantity } : i
      );
      localStorage.setItem("digitalist_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("digitalist_cart");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist actions
  const toggleWishlist = (id: number, type: "product" | "course") => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === id && w.type === type);
      let updated;
      if (exists) {
        updated = prev.filter((w) => !(w.id === id && w.type === type));
        showToast("از لیست علاقه‌مندی‌ها حذف شد.");
      } else {
        updated = [...prev, { id, type }];
        showToast("به لیست علاقه‌مندی‌ها اضافه شد.");
      }
      localStorage.setItem("digitalist_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isWishlisted = (id: number, type: "product" | "course") => {
    return wishlist.some((w) => w.id === id && w.type === type);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      showToast("با موفقیت از حساب کاربری خارج شدید.");
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        setUser,
        logout,
        refreshUser,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce transition-all duration-300">
          <div className="bg-slate-900/95 dark:bg-sky-950/95 text-white border border-sky-500/40 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
