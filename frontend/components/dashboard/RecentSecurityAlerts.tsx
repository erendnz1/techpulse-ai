"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

type Alert = {
  id: number;
  title: string;
  summary?: string;
  risk_level?: string;
  published_at?: string;
};

const badgeStyles = (risk?: string) => {
  switch (risk) {
    case "Critical":
      return "bg-red-500 text-white";

    case "High":
      return "bg-orange-500 text-white";

    case "Medium":
      return "bg-yellow-500 text-white";

    case "Low":
      return "bg-emerald-500 text-white";

    default:
      return "bg-blue-500 text-white";
  }
};

export default function RecentSecurityAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news/security?skip=0&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load security alerts.");
        }

        const data = await response.json();

        setAlerts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div
      className="
        h-full
        rounded-2xl
        border
        border-gray-200
        bg-white/70
        p-6
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-red-500/20
        hover:shadow-xl
        dark:border-white/10
        dark:bg-white/5
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Recent Security Alerts
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Latest AI-detected vulnerabilities
          </p>
        </div>

        <Link
          href="/dashboard/security"
          className="flex items-center gap-1 text-sm font-medium text-blue-500 transition hover:text-blue-600"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="
              rounded-xl
              border
              border-gray-200
              p-4
              transition-all
              duration-300
              hover:border-red-300
              hover:shadow-md
              dark:border-white/10
            "
          >
            {/* Top */}
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles(
                  item.risk_level
                )}`}
              >
                {item.risk_level ?? "Unknown"}
              </span>

              <span className="text-xs text-gray-500">
                {item.published_at?.split("T")[0]}
              </span>
            </div>

            {/* Title */}
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 text-red-500 flex-shrink-0" />

              <div className="min-w-0">
                <p className="line-clamp-2 font-semibold">
                  {item.title}
                </p>

                {item.summary && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {item.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-white/10">
            <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-gray-400" />

            <p className="font-medium">
              No security alerts found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Everything looks secure for now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}