"use client";

import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor?: string;
  trend?: string;
  trendColor?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor = "text-white",
  trend,
  trendColor = "text-green-500",
}: StatCardProps) {
 return (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm  transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/5">

    
    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
    </div>{/* Glow */}

    <div className="relative flex items-start justify-between">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          {value}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>

        {trend && (
          <span
            className={`mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold dark:bg-gray-800 ${trendColor}`}
          >
            {trend}
          </span>
        )}

      </div>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
      >
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>

    </div>

  </div>
);
}