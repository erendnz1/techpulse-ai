"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  ShieldAlert,
  Bell,
  Settings,
  User,
  X,
  Cpu,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  closeMenu: () => void;
  unreadCount: number;
}

export default function Sidebar({
  isOpen,
  closeMenu,
  unreadCount,
}: SidebarProps) {
  const pathname = usePathname();
   const router = useRouter();
   const [user, setUser] = useState<{
  username: string;
  email: string;
} | null>(null);
  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/news",
      label: "News",
      icon: Newspaper,
    },
    {
      href: "/dashboard/security",
      label: "Security Alerts",
      icon: ShieldAlert,
    },
    {
      href: "/dashboard/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      href: "/dashboard/preferences",
      label: "Preferences",
      icon: Settings,
    },
    {
  href: "/dashboard/profile",
  label: "Profile",
  icon: User,
},
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      closeMenu();
    }
  };
const handleLogout = () => {
  localStorage.removeItem("access_token");
  router.replace("/login");
};
useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) return;

  fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      return res.json();
    })
    .then((data) => {
      setUser(data);
    })
    .catch((err) => {
      console.error(err);
    });
}, []);
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          h-screen w-72 overflow-y-auto
          border-r border-gray-200
          bg-white/80
          backdrop-blur-xl
          shadow-xl
          transition-all duration-500 ease-out
          dark:border-gray-700
          dark:bg-gray-900/80

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:sticky
          lg:top-0
          lg:translate-x-0
          lg:flex-shrink-0
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 lg:hidden dark:border-gray-700">

  <div className="flex items-center gap-3">

    <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/30">
      <Cpu size={20} />
    </div>

    <div>
      <h2 className="text-lg font-bold">
        TechPulse
        <span className="text-blue-600">
          {" "}AI
        </span>
      </h2>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Technology Intelligence
      </p>
    </div>

  </div>

  <button
    onClick={closeMenu}
    className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <X size={22} />
  </button>

</div>

        {/* Desktop Logo */}
        <div className="hidden border-b border-gray-200 p-6 dark:border-gray-700 lg:block">

  <div className="flex items-center gap-3">

    <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/30">
      <Cpu size={22} />
    </div>

    <div>

      <h2 className="text-xl font-bold tracking-tight">
        TechPulse
        <span className="text-blue-600">
          {" "}AI
        </span>
      </h2>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Technology Intelligence
      </p>

    </div>

  </div>

</div>
        <nav className="flex flex-1 flex-col px-4 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
               className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 hover:-translate-x-1 hover:scale-[1.02]
${
  active
    ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
    : "border-transparent text-gray-600 hover:border-blue-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
}`}
              >
                <Icon
  size={18}
  className={`transition-transform duration-300 ${
    active ? "scale-110" : "group-hover:scale-110"
  }`}
/>

                <span className="flex-1">
                  {item.label}
                </span>

                {item.href ===
                  "/dashboard/notifications" &&
                  unreadCount > 0 && (
                    <span
                      className={`flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        active
                          ? "bg-white text-blue-600"
                          : "bg-red-500 text-white animate-[pulse_2s_infinite]"
                      }`}
                    >
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
              </Link>
            );
          })}
          <div className="flex-1" />
        </nav>
        <div className="mt-4 border-t border-gray-200 p-5 dark:border-gray-700">

  <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">

  <div className="flex items-center gap-3">

    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-110">
  {user?.username?.charAt(0).toUpperCase() ?? "U"}
</div>

    <div className="min-w-0">
  {user ? (
    <>
      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
        {user.username}
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {user.email}
      </p>
    </>
  ) : (
    <>
      <div className="h-4 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />

      <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
    </>
  )}
</div>

  </div>

</div>

  <button
  onClick={handleLogout}
  className="group flex w-full items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-red-300 hover:bg-red-100 hover:shadow-lg hover:shadow-red-500/20 active:scale-95 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/20"
>
  <LogOut
    size={18}
    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-6"
  />

  <span>Logout</span>
</button>
</div>
      </aside>
    </>
  );
}