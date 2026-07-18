"use client";

import { LucideIcon } from "lucide-react";

type Item = {
  label: string;
  value: number;
  icon?: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
};

type Props = {
  title: string;
  subtitle: string;
  badge?: string;
  items: Item[];
};

export default function DashboardProgressCard({
  title,
  subtitle,
  badge,
  items,
}: Props) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="group h-full rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm  transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl dark:border-white/10 dark:bg-white/5">

      {/* Header */}

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>

        </div>

        {badge && (
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 transition-all duration-300 group-hover:scale-105 dark:text-blue-400">
            {badge}
          </span>
        )}

      </div>

      {/* Items */}

      <div className="space-y-3">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="group/item rounded-xl border border-transparent p-2 transition-all duration-300 hover:border-blue-500/10 hover:bg-blue-500/[0.03]"
            >
              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  {Icon && (
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bgColor} transition-all duration-300 group-hover/item:scale-110`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${item.iconColor}`}
                      />
                    </div>
                  )}

                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>

                </div>

                <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-600 transition-all duration-300 group-hover/item:border-blue-200 group-hover/item:bg-blue-50 group-hover/item:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:group-hover/item:border-blue-500/20 dark:group-hover/item:bg-blue-500/10 dark:group-hover/item:text-blue-300">
                  {item.value}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">

                <div
                  className={`${item.color} h-full rounded-full transition-all duration-700 group-hover/item:brightness-110`}
                  style={{
                    width: `${(item.value / max) * 100}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}