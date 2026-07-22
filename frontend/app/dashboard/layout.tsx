"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import useMobileMenu from "@/hooks/useMobileMenu";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const {
    isOpen,
    openMenu,
    closeMenu,
  } = useMobileMenu();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then(async (res) => {
  if (res.status === 401) {
    setUnreadCount(0);
    return null;
  }

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Failed (${res.status})`);
  }

  return res.json();
})

        .then((data) => {
  setUnreadCount(data?.unread_count ?? 0);
})
        .catch((error) => {
          console.error(
            "Unread notification count error:",
            error
          );
          setUnreadCount(0);
        });
    };

    fetchUnreadCount();

    window.addEventListener(
      "notifications-updated",
      fetchUnreadCount
    );

    return () => {
      window.removeEventListener(
        "notifications-updated",
        fetchUnreadCount
      );
    };
  }, [pathname]);

  return (
    <AuthGuard>
     <main className="relative min-h-screen overflow-x-hidden bg-white text-slate-950 transition-colors dark:bg-gray-900 dark:text-white">

        <div className="pointer-events-none absolute left-0 right-0 top-0 h-screen bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_50%_30%,rgba(37,99,235,0.18),transparent_45%)]" />

        <div className="relative z-10 flex min-h-screen">

          <Sidebar
            isOpen={isOpen}
            closeMenu={closeMenu}
            unreadCount={unreadCount}
          />

          <div className="flex min-w-0 flex-1 flex-col">

            <MobileHeader
              onMenuClick={openMenu}
            />

            <div className="flex-1 px-4 py-4 sm:px-6 lg:px-10">
  {children}
</div>

          </div>

        </div>

      </main>
    </AuthGuard>
  );
}