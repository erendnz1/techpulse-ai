"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch notifications");
        }

        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          setNotifications([]);
        }
      })
      .catch((error) => {
        console.error("Notification fetch error:", error);
        setNotifications([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-transparent p-10 text-slate-950 dark:text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        {notifications.some((notification) => !notification.is_read) && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
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
        <div className="mt-10 flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />

          <span>Loading notifications...</span>
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
        <div className="mt-8 grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`cursor-pointer rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
                notification.is_read
                  ? "border-gray-200 bg-white/60 dark:border-gray-700 dark:bg-gray-800/40"
                  : "border-blue-300 bg-blue-50/70 shadow-sm dark:border-blue-500/30 dark:bg-blue-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  {!notification.is_read && (
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                  )}

                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {notification.message}
                    </p>

                    {notification.created_at && (
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {new Date(
                          notification.created_at
                        ).toLocaleString("en-US", {
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
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    notification.is_read
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  }`}
                >
                  {notification.is_read ? "Read" : "New"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}