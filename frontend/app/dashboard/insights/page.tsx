"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  Cloud,
  Newspaper,
  Database,
} from "lucide-react";

type DashboardStats = {
  total_news: number;
  unread_notifications: number;

  categories: Record<string, number>;
  risk_levels: Record<string, number>;
  sources: Record<string, number>;

  ai_articles: number;
  cloud_articles: number;
  critical_alerts: number;

  top_category: string | null;
  top_source: string | null;
};

export default function InsightsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setStats(await response.json());
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        Loading insights...
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-10 md:px-10">

      <div className="mb-10">

        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-violet-500" />

          <div>
            <h1 className="text-3xl font-bold">
              AI Insights
            </h1>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              AI-powered analysis of the latest technology news.
            </p>
          </div>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Newspaper className="mb-3 h-7 w-7 text-violet-500" />

          <p className="text-sm text-gray-500">
            AI Articles
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.ai_articles}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Cloud className="mb-3 h-7 w-7 text-blue-500" />

          <p className="text-sm text-gray-500">
            Cloud Updates
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.cloud_articles}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <ShieldAlert className="mb-3 h-7 w-7 text-red-500" />

          <p className="text-sm text-gray-500">
            Critical Alerts
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.critical_alerts}
          </h2>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Database className="mb-3 h-7 w-7 text-emerald-500" />

          <p className="text-sm text-gray-500">
            Total News
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {stats.total_news}
          </h2>
        </div>

      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">

          <h2 className="mb-6 text-xl font-semibold">
            AI Analysis
          </h2>

          <div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300">

            <p>
              🤖 <strong>{stats.ai_articles}</strong> AI-related articles have been analyzed.
            </p>

            <p>
              ☁ <strong>{stats.cloud_articles}</strong> cloud technology updates have been detected.
            </p>

            <p>
              🛡 Currently there are{" "}
              <strong>{stats.critical_alerts}</strong> critical security alerts.
            </p>

            <p>
              📈 The most active category is{" "}
              <strong>{stats.top_category}</strong>.
            </p>

            <p>
              🌐 The most active source is{" "}
              <strong>{stats.top_source}</strong>.
            </p>

          </div>

        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">

          <h2 className="mb-6 text-xl font-semibold">
            AI Summary
          </h2>

          <div className="space-y-4 text-sm leading-7 text-gray-600 dark:text-gray-300">

            <p>
              Software technology continues to dominate today's news ecosystem.
            </p>

            <p>
              AI and Cloud remain among the fastest-growing technology categories.
            </p>

            <p>
              Security monitoring indicates that the number of critical vulnerabilities is currently manageable.
            </p>

            <p>
              TechPulse AI continuously monitors multiple trusted technology sources and provides AI-assisted insights to help developers quickly identify important updates.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}