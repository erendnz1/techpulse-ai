"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type DashboardStats = {
  ai_articles: number;
  cloud_articles: number;
  critical_alerts: number;
  top_category: string | null;
  top_source: string | null;
};

type AISummaryProps = {
  stats?: DashboardStats;
};

export default function AISummary({
  stats,
}: AISummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">

      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold">
          AI Insights
        </h2>
      </div>

      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        Live insights generated from the latest technology news.
      </p>

      <div className="mt-4 space-y-3">

        <div className="flex items-center justify-between rounded-lg bg-violet-500/10 px-3 py-2 text-sm">
          <span>🤖 AI Articles</span>
          <strong>{stats?.ai_articles ?? 0}</strong>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-blue-500/10 px-3 py-2 text-sm">
          <span>☁ Cloud Updates</span>
          <strong>{stats?.cloud_articles ?? 0}</strong>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-red-500/10 px-3 py-2 text-sm">
          <span>🛡 Critical Alerts</span>
          <strong>{stats?.critical_alerts ?? 0}</strong>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-sm">
          <span>🏆 Top Category</span>
          <strong>{stats?.top_category ?? "-"}</strong>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2 text-sm">
          <span>🌐 Top Source</span>
          <strong>{stats?.top_source ?? "-"}</strong>
        </div>

      </div>

      <Link
        href="/dashboard/insights"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600"
      >
        View detailed analysis
        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}