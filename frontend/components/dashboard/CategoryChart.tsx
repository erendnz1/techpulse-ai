"use client";

import {
  Brain,
  ShieldAlert,
  Code2,
  Cloud,
  Smartphone,
} from "lucide-react";

type Props = {
  categories?: Record<string, number>;
};

const iconMap: Record<string, any> = {
  AI: Brain,
  Security: ShieldAlert,
  Software: Code2,
  Cloud: Cloud,
  Mobile: Smartphone,
};

const colorMap: Record<string, string> = {
  AI: "bg-blue-500",
  Security: "bg-red-500",
  Software: "bg-violet-500",
  Cloud: "bg-cyan-500",
  Mobile: "bg-emerald-500",
};

const iconColorMap: Record<string, string> = {
  AI: "text-blue-500",
  Security: "text-red-500",
  Software: "text-violet-500",
  Cloud: "text-cyan-500",
  Mobile: "text-emerald-500",
};

export default function CategoryChart({ categories }: Props) {
  const data = Object.entries(categories ?? {})
    .filter(([name]) => name !== "None")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const max = data.length ? data[0][1] : 1;

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Top Categories
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Most active topics
          </p>
        </div>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          TOP 5
        </span>

      </div>

      <div className="space-y-5">

        {data.map(([name, value]) => {
          const Icon = iconMap[name];

          return (
            <div key={name}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  {Icon && (
                    <Icon
                      className={`h-5 w-5 ${
                        iconColorMap[name] ?? "text-blue-500"
                      }`}
                    />
                  )}

                  <span className="text-sm font-medium">
                    {name}
                  </span>

                </div>

                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {value}
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">

                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    colorMap[name] ?? "bg-blue-500"
                  }`}
                  style={{
                    width: `${(value / max) * 100}%`,
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