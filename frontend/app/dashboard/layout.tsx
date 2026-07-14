"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  ShieldAlert,
  Bell,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-slate-950 transition-colors dark:bg-gray-900 dark:text-white">
      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18),transparent_45%)]" />

      <div className="relative z-10 flex min-h-screen">
        
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white/60 p-6 backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/60 md:block">
          
          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-tight">
              TechPulse <span className="text-blue-600">AI</span>
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Technology Intelligence
            </p>
          </div>

          <nav className="space-y-2">
           <Link
  href="/dashboard"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    pathname === "/dashboard"
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`}
>
  <LayoutDashboard size={18} />
  Overview
</Link>

            <Link
  href="/dashboard/news"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    pathname === "/dashboard/news"
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`}
>
  <Newspaper size={18} />
  News
</Link>

          <Link
  href="/dashboard/security"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    pathname === "/dashboard/security"
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`}
>
  <ShieldAlert size={18} />
  Security Alerts
</Link>
<Link
  href="/dashboard/notifications"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    pathname === "/dashboard/notifications"
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`}
>
  <Bell size={18} />
  Notifications
</Link>
            <Link
  href="/dashboard/preferences"
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
    pathname === "/dashboard/preferences"
      ? "bg-blue-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`}
>
  <Settings size={18} />
  Preferences
</Link>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {children}
        </div>

      </div>
    </main>
  );
}