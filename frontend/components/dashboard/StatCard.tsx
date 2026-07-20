"use client";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
  
}:
StatCardProps) {
  const [displayValue, setDisplayValue] = useState(value);

useEffect(() => {
  if (typeof value !== "number") {
    setDisplayValue(value);
    return;
  }

  let start = 0;
  const end = value;
  const duration = 900;
  let startTime: number | null = null;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);

    const current = Math.floor(progress * (end - start) + start);

    setDisplayValue(current);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}, [value]);
 return (
  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm  transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20 dark:border-white/10 dark:bg-white/5">
   <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-violet-500 opacity-80" />
    
    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
    </div>{/* Glow */}

    <div className="relative flex items-start justify-between">

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
          {title}
        </p>

        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {displayValue}
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>

        {trend && (
          <span
            className={`mt-4 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold shadow-sm dark:border-white/10 dark:bg-white/5 ${trendColor}`}
          >
            {trend}
          </span>
        )}

      </div>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}
      >
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>

    </div>

  </div>
);
}