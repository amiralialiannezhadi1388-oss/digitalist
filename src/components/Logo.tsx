import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
    >
      {/* Tech & Violin fusion icon */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-900 p-0.5 border border-sky-500/30 shadow-md shadow-sky-500/10 group-hover:border-sky-400/60 transition-all duration-300 flex items-center justify-center overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.35),transparent_70%)]" />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5/6 h-5/6 relative z-10 transition-transform duration-300 group-hover:scale-105"
        >
          {/* Hexagonal cyber chip boundary */}
          <path
            d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Stylized Violin F-hole & Binary Circuit fusion */}
          <path
            d="M18.5 8.5C18.5 8.5 14.5 11 14.5 15C14.5 19 18 19 18 22C18 24 16 24.5 14 24.5"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Violin F-hole nicks / digital bit dots */}
          <circle cx="18.5" cy="8.5" r="1.5" fill="#38bdf8" />
          <circle cx="14" cy="24.5" r="1.5" fill="#38bdf8" />
          {/* Tech node center */}
          <path
            d="M12 16H20"
            stroke="#93c5fd"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="16" cy="16" r="1" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white transition-colors ${textSizes[size]}`}
            >
              دیجیتالیست
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
            برند شخصی هکر امیر
          </span>
        </div>
      )}
    </Link>
  );
}
