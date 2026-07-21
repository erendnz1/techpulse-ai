"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Newspaper,
  Bell,
  ShieldAlert,
  RefreshCcw,
} from "lucide-react";

interface Stats {
  total_users: number;
  total_news: number;
  total_notifications: number;
  ai_articles: number;
  critical_alerts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setStats);
  }, []);

  async function fetchNews() {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/fetch`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    alert(
      `${data.saved_count} new articles fetched.`
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">

      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Platform Management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Users"
          value={stats.total_users}
          icon={<Users size={26} />}
        />

        <StatCard
          title="News"
          value={stats.total_news}
          icon={<Newspaper size={26} />}
        />

        <StatCard
          title="Notifications"
          value={stats.total_notifications}
          icon={<Bell size={26} />}
        />

        <StatCard
          title="Critical Alerts"
          value={stats.critical_alerts}
          icon={<ShieldAlert size={26} />}
        />

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-xl font-semibold">
          Quick Actions
        </h2>

        <button
          onClick={fetchNews}
          className="flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <RefreshCcw size={18} />

          Fetch Latest News
        </button>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>

      </div>

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>

    </div>
  );
}