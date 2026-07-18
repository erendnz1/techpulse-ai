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

  <div className="flex items-center gap-4">

    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
      <Sparkles className="h-7 w-7 text-violet-500" />
    </div>

    <div>

      <h1 className="text-4xl font-bold tracking-tight">
        AI Intelligence Center
      </h1>

      <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
        AI-powered analysis of software trends, technology ecosystems,
        cloud activity and security intelligence collected from trusted
        sources.
      </p>

    </div>

  </div>

</div>
<div className="mb-8 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-transparent p-6">

  <div className="mb-3 flex items-center gap-2">

    <Sparkles className="h-5 w-5 text-violet-500" />

    <h2 className="text-xl font-semibold">
      Today's AI Executive Summary
    </h2>

  </div>

  <p className="leading-8 text-gray-600 dark:text-gray-300">

    TechPulse AI analyzed

    <span className="font-semibold text-violet-500">
      {" "}{stats.total_news}{" "}
    </span>

    technology articles today.

    Framework technologies remain the most active ecosystem while cloud
    platforms continue to grow steadily.

    Security monitoring detected

    <span className="font-semibold text-red-500">
      {" "}{stats.critical_alerts}{" "}
    </span>

    critical vulnerabilities requiring attention.

  </p>

</div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  {/* AI Articles */}

  <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5">

    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 transition-transform duration-300 group-hover:scale-110">
      <Newspaper className="h-6 w-6 text-violet-500" />
    </div>

    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
      AI Articles
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.ai_articles}
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      AI analyzed news
    </p>

  </div>

  {/* Cloud */}

  <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5">

    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
      <Cloud className="h-6 w-6 text-blue-500" />
    </div>

    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
      Cloud Updates
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.cloud_articles}
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Latest cloud ecosystem
    </p>

  </div>

  {/* Critical */}

  <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5">

    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 transition-transform duration-300 group-hover:scale-110">
      <ShieldAlert className="h-6 w-6 text-red-500" />
    </div>

    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
      Critical Alerts
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.critical_alerts}
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Require attention
    </p>

  </div>

  {/* Total */}

  <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5">

    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 transition-transform duration-300 group-hover:scale-110">
      <Database className="h-6 w-6 text-emerald-500" />
    </div>

    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
      Total News
    </p>

    <h2 className="mt-2 text-3xl font-bold">
      {stats.total_news}
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      Articles collected
    </p>

  </div>

</div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">

  {/* AI Analysis */}

  <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">

    <div className="mb-6 flex items-center gap-2">

      <Sparkles className="h-5 w-5 text-violet-500"/>

      <h2 className="text-xl font-semibold">
        AI Analysis
      </h2>

    </div>

    <div className="space-y-4">

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 transition hover:border-violet-500/40">

        <div className="mb-2 flex items-center gap-2">

          🤖

          <span className="font-semibold">
            AI Articles
          </span>

        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">

          <strong>{stats.ai_articles}</strong> AI-related articles were
          analyzed successfully.

        </p>

      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 transition hover:border-blue-500/40">

        <div className="mb-2 flex items-center gap-2">

          ☁

          <span className="font-semibold">
            Cloud Activity
          </span>

        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">

          <strong>{stats.cloud_articles}</strong> cloud ecosystem updates
          were detected.

        </p>

      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 transition hover:border-red-500/40">

        <div className="mb-2 flex items-center gap-2">

          🛡

          <span className="font-semibold">
            Security Monitoring
          </span>

        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">

          There are currently

          <strong> {stats.critical_alerts} </strong>

          critical security alerts requiring attention.

        </p>

      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition hover:border-emerald-500/40">

        <div className="mb-2 flex items-center gap-2">

          📈

          <span className="font-semibold">
            Ecosystem Activity
          </span>

        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300">

          <strong>{stats.top_category}</strong> is currently the most active
          technology category while

          <strong> {stats.top_source}</strong>

          contributes the highest number of articles.

        </p>

      </div>

    </div>

  </div>

  {/* AI Summary */}

  <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">

    <div className="mb-6 flex items-center gap-2">

      <Sparkles className="h-5 w-5 text-violet-500"/>

      <h2 className="text-xl font-semibold">

        Today's AI Summary

      </h2>

    </div>

    <div className="space-y-5">

      <div className="flex gap-3">

        <span className="mt-1 text-lg">
          📌
        </span>

        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

          Framework technologies continue to dominate the software ecosystem.

        </p>

      </div>

      <div className="flex gap-3">

        <span className="mt-1 text-lg">
          ☁
        </span>

        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

          Cloud platforms remain one of today's fastest-growing categories.

        </p>

      </div>

      <div className="flex gap-3">

        <span className="mt-1 text-lg">
          🛡
        </span>

        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

          Critical security activity remains at a manageable level.

        </p>

      </div>

      <div className="flex gap-3">

        <span className="mt-1 text-lg">
          🌍
        </span>

        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

          TechPulse AI continuously monitors trusted technology sources and
          generates AI-powered insights for software teams.

        </p>

      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

        <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">

          💡 AI Recommendation

        </h3>

        <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">

          Monitor <strong>{stats.top_category}</strong> updates,
          review security advisories regularly and keep following
          trusted technology sources.

        </p>

      </div>

    </div>

  </div>

</div>

    </main>
  );
}