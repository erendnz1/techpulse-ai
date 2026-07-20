"use client";

import {
  Brain,
  ShieldAlert,
  Code2,
  Cloud,
  Smartphone,
  Boxes,
  Wrench,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Props = {
  categories?: Record<string, number>;
};

const iconMap = {
  AI: Brain,
  Security: ShieldAlert,
  Software: Code2,
  Cloud: Cloud,
  Mobile: Smartphone,
  Framework: Boxes,
  "Developer Tools": Wrench,
};

const iconColorMap = {
  AI: "text-blue-500",
  Security: "text-red-500",
  Software: "text-violet-500",
  Cloud: "text-cyan-500",
  Mobile: "text-emerald-500",
  Framework: "text-indigo-500",
  "Developer Tools": "text-sky-500",
};

const chartColors: Record<string, string> = {
  AI: "#3b82f6",
  Security: "#ef4444",
  Software: "#8b5cf6",
  Cloud: "#06b6d4",
  Mobile: "#10b981",
  Framework: "#2563eb",
  "Developer Tools": "#0ea5e9",
  Business: "#f59e0b",
  Gaming: "#ec4899",
};

export default function CategoryChart({ categories }: Props) {
  const items = Object.entries(categories ?? {})
    .filter(([name]) => name !== "None")
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      label: name,
      value,
      icon: iconMap[name as keyof typeof iconMap],
      iconColor:
        iconColorMap[name as keyof typeof iconColorMap] ??
        "text-blue-500",
      fill: chartColors[name] ?? "#3b82f6",
    }));

  return (
    <div className="group h-full rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl dark:border-white/10 dark:bg-white/5">

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Top Categories
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Most active technology topics
          </p>

        </div>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600">
          TOP 5
        </span>

      </div>

      <div className="flex flex-col items-center gap-6">

  <div className="relative h-[180px] w-[180px]">

    <ResponsiveContainer width="100%" height="100%">

      <PieChart>

        <Pie
          data={items}
          dataKey="value"
          innerRadius={55}
          outerRadius={82}
          paddingAngle={3}
        >
          {items.map((entry) => (
            <Cell
              key={entry.label}
              fill={entry.fill}
            />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>

    </ResponsiveContainer>

  </div>

  <div className="w-full space-y-3">

    {items.map((item) => {

      const Icon = item.icon;

      return (

        <div
          key={item.label}
          className="group/item flex items-center justify-between rounded-xl border border-gray-200 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/20 hover:bg-blue-500/[0.03] dark:border-white/10 dark:hover:border-blue-500/20 dark:hover:bg-blue-500/10"
        >

          <div className="flex min-w-0 items-center gap-3">

            {Icon && (
              <Icon
                className={`h-5 w-5 transition-transform duration-300 group-hover/item:scale-110 ${item.iconColor}`}
              />
            )}

            <span className="truncate font-medium text-gray-800 dark:text-gray-200">
              {item.label}
            </span>

          </div>

          <span className="ml-4 shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-bold dark:border-white/10 dark:bg-white/5">
            {item.value}
          </span>

        </div>

      );

    })}

  </div>

</div>

    </div>
  );
}