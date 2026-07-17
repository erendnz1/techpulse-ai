"use client";

import { Bell, CalendarDays, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
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
  return (
    <header className="mb-10">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        {/* Left */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-500">
            Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {username || "User"}
            </span>
            👋
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500 dark:text-gray-400">
            Here's what's happening in the technology world today.
            Stay updated with AI, Security, Cloud, Developer Tools
            and Software news.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 xl:items-end">

          {/* Search */}
          <div className="relative w-full xl:w-[340px]">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search technologies..."
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
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