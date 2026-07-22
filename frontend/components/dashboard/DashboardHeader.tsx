"use client";

import { Bell, CalendarDays, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
type DashboardHeaderProps = {
  username?: string;
  unreadCount?: number;
};

export default function DashboardHeader({
  username,
  unreadCount = 0,
}: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const router = useRouter();
const [query, setQuery] = useState("");
const [results, setResults] = useState<any[]>([]);
const [loadingSearch, setLoadingSearch] = useState(false);

const searchRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target as Node)
    ) {
      setResults([]);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
}, []);
useEffect(() => {
  if (query.trim().length < 2) {
    setResults([]);
    return;
  }

  const timeout = setTimeout(async () => {
    try {
      setLoadingSearch(true);

      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/search?q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setResults(await res.json());
    } catch {
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, 300);

  return () => clearTimeout(timeout);
}, [query]);
  return (
    <header className="mb-6 sm:mb-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Left */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {username || "User"}
            </span>
            👋
          </h1>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Here's what's happening in the technology world today.
            Stay updated with AI, Security, Cloud, Developer Tools , Framework updates, and Software news.
            
          </p>
        </div>

        {/* Right */}
        <div className="flex w-full flex-col gap-4 lg:w-auto lg:items-end">

          {/* Search */}
          <div
  ref={searchRef}
  className="relative w-full lg:w-[340px]"
>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(
        `/dashboard/news?q=${encodeURIComponent(query)}`
      );
      setResults([]);
    }
  }}
  type="text"
  placeholder="Search technologies..."
  className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
/>
{(loadingSearch || results.length > 0 || query.length >= 2) && (
  <div className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">

    {loadingSearch && (
      <div className="px-4 py-3 text-sm text-gray-500">
        Searching...
      </div>
    )}

    {!loadingSearch &&
      results.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            router.push(`/dashboard/news/${item.id}`);
            setResults([]);
            setQuery("");
          }}
          className="flex w-full flex-col border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
        >
          <span className="line-clamp-1 font-medium">
            {item.title}
          </span>

          <span className="mt-1 text-xs text-gray-500">
            {item.category} • {item.source}
          </span>
        </button>
      ))}

    {!loadingSearch &&
      query.length >= 2 &&
      results.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-500">
          No results found.
        </div>
      )}

    {!loadingSearch &&
      results.length > 0 && (
        <button
          onClick={() => {
            router.push(
              `/dashboard/news?q=${encodeURIComponent(query)}`
            );
            setResults([]);
          }}
          className="w-full bg-gray-50 px-4 py-3 text-center text-sm font-medium text-blue-600 transition hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          View all results →
        </button>
      )}

  </div>
)}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 sm:px-4 dark:border-gray-700 dark:bg-gray-900">
              <CalendarDays className="h-4 w-4 text-blue-500" />

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {today}
              </span>
            </div>
<button
  onClick={() => router.push("/dashboard/notifications")}
  className="group relative rounded-xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
>
  <Bell
    className={`h-5 w-5 transition-all duration-300 ${
      unreadCount > 0
        ? "animate-[ring_2.5s_ease-in-out_infinite]"
        : "group-hover:rotate-12"
    }`}
  />

  {unreadCount > 0 && (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  )}
</button>

            <ThemeToggle />

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg">
              {username?.charAt(0).toUpperCase() || "U"}
            </div>

          </div>
        </div>

      </div>
    </header>
  );
}