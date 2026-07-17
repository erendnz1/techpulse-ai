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
    <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl dark:border-white/10 dark:bg-white/5">

  <div className="flex items-start justify-between">

    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight">
        {value}
      </h2>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>

      {trend && (
        <p className={`mt-2 text-sm font-semibold ${trendColor}`}>
          {trend}
        </p>
      )}

    </div>

    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition group-hover:scale-110`}
    >
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </div>

  </div>

</div>
  );
}