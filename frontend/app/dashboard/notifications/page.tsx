"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NotificationSkeleton from "@/components/skeletons/NotificationSkeleton";
export default function NotificationsPage() {
  const router = useRouter();

  const LIMIT = 20;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (loadMore = false) => {
    const token = localStorage.getItem("access_token");

    const currentSkip = loadMore ? skip : 0;

    try {
      setError("");
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/me?skip=${currentSkip}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();

      if (loadMore) {
        setNotifications((prev) => [...prev, ...data]);
        setSkip(currentSkip + data.length);
      } else {
        setNotifications(data);
        setSkip(data.length);
      }

      setHasMore(data.length === LIMIT);
    } catch (error) {
  console.error("Notification fetch error:", error);

  if (!loadMore) {
    setNotifications([]);
    setError(
      "Unable to load notifications. Please try again."
    );
  }
}finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: number) => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      window.dispatchEvent(new Event("notifications-updated"));

      return true;
    } catch (error) {
      console.error("Mark notification as read error:", error);

      return false;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    router.push(`/dashboard/news/${notification.news_id}`);
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read");
      }

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Mark all notifications as read error:", error);
    }
  };

  return (
        <main className="min-h-screen bg-transparent px-4 py-5 text-slate-950 dark:text-white sm:px-6 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        {notifications.some((notification) => !notification.is_read) && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="w-full sm:w-auto rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
          >
            Mark all as read
          </button>
        )}
      </div>

      <p className="mt-3 text-gray-500 dark:text-gray-400">
        View your latest technology alerts and important updates.
      </p>

      {!loading && (
        <p className="mt-2 text-sm text-gray-400">
          {notifications.length} notifications found
        </p>
      )}

      {loading && (
  <div className="mt-8 grid gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <NotificationSkeleton key={index} />
    ))}
  </div>
)}
{!loading && error && (
  <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">

    <h3 className="font-semibold text-red-700 dark:text-red-400">
      Unable to load notifications
    </h3>

    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Please try again later.
    </p>

  </div>
)}

      {!loading && notifications.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
          <p className="font-medium text-gray-700 dark:text-gray-200">
            No notifications found.
          </p>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You do not have any technology alerts or important updates yet.
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <div className="mt-8 grid gap-4">
            {notifications.map((notification) => {
  const isSecurity = notification.message.includes("Security");

  return (
    <article
      key={notification.id}
      onClick={() => handleNotificationClick(notification)}
      className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        notification.is_read
          ? "border-gray-200 bg-white/60 dark:border-gray-700 dark:bg-gray-800/40"
          : isSecurity
          ? "border-red-500/40 bg-red-500/10 hover:bg-red-500/15 hover:shadow-[0_0_35px_rgba(239,68,68,0.18)]"
          : "border-blue-300 bg-blue-50/70 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          {!notification.is_read && (
            <span
              className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                isSecurity ? "bg-red-500" : "bg-blue-500"
              }`}
            />
          )}

          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {notification.message}
            </p>

            {notification.created_at && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {new Date(notification.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>

        <span
 className={`self-start rounded-full px-3 py-1 text-xs font-medium ${
            notification.is_read
              ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              : isSecurity
              ? "bg-red-500/20 text-red-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          }`}
        >
          {notification.is_read ? "Read" : "New"}
        </span>
      </div>
    </article>
  );
})}
                
          
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
 onClick={() => fetchNotifications(true)}
 disabled={loadingMore}
 className="w-full rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
>
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}