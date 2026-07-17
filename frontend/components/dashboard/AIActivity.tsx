"use client";

import {
  Brain,
  Newspaper,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

type Props = {
  stats?: {
    total_news: number;
    unread_notifications: number;
    categories: Record<string, number>;
    risk_levels: Record<string, number>;
  };
};

export default function AIActivity({ stats }: Props) {
  const totalNews = stats?.total_news ?? 0;
  const critical = stats?.risk_levels?.Critical ?? 0;
  const security = stats?.categories?.Security ?? 0;

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
        hover:border-violet-500/30
        hover:shadow-xl
        dark:border-white/10
        dark:bg-white/5
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Brain className="h-5 w-5 text-violet-500" />
            AI Activity
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Real-time AI monitoring
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500">
          ● Active
        </span>
      </div>

      <div className="space-y-4">
        {/* Articles */}
        <div className="flex items-center justify-between rounded-xl bg-blue-500/10 p-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-5 w-5 text-blue-500" />

            <div>
              <p className="font-medium">Articles Analyzed</p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Processed by AI engine
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold">
            {totalNews}
          </span>
        </div>

        {/* Security */}
        <div className="flex items-center justify-between rounded-xl bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-500" />

            <div>
              <p className="font-medium">Security Articles</p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Potential security threats
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold">
            {security}
          </span>
        </div>

        {/* Critical */}
        <div className="flex items-center justify-between rounded-xl bg-orange-500/10 p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-orange-500" />

            <div>
              <p className="font-medium">
                Critical Vulnerabilities
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                High priority issues
              </p>
            </div>
          </div>

          <span className="text-2xl font-bold">
            {critical}
          </span>
        </div>

        {/* AI Processing */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-emerald-500" />

            <div>
              <p className="font-medium">
                AI Processing
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Latest analysis completed
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
            Completed
          </span>
        </div>
      </div>
    </div>
  );
}