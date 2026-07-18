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

const items = (stats?: DashboardStats) => [
  {
    label: "AI Articles",
    value: stats?.ai_articles ?? 0,
    icon: "🤖",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    label: "Cloud Updates",
    value: stats?.cloud_articles ?? 0,
    icon: "☁",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    label: "Critical Alerts",
    value: stats?.critical_alerts ?? 0,
    icon: "🛡",
    color: "bg-red-500/10 text-red-400",
  },
  {
    label: "Top Category",
    value: stats?.top_category ?? "-",
    icon: "🏆",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    label: "Top Source",
    value: stats?.top_source ?? "-",
    icon: "🌐",
    color: "bg-amber-500/10 text-amber-400",
  },
];

export default function AISummary({ stats }: AISummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">

      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold">
          AI Insights
        </h2>
      </div>

      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
        AI-powered analysis of technology trends, security risks and ecosystem activity.
      </p>

      <div className="mt-5 space-y-3">

        {items(stats).map((item) => (
          <div
            key={item.label}
            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 hover:scale-[1.02] ${item.color}`}
          >
            <span className="flex items-center gap-2 font-medium">
              <span>{item.icon}</span>
              {item.label}
            </span>

            <span className="rounded-md bg-black/10 px-2 py-1 text-sm font-bold dark:bg-white/10">
              {item.value}
            </span>
          </div>
        ))}

      </div>

      <Link
        href="/dashboard/insights"
        className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-600"
      >
        View detailed analysis

        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

    </div>
  );
}