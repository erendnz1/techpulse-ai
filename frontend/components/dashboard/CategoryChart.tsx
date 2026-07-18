"use client";

import {
  Brain,
  ShieldAlert,
  Code2,
  Cloud,
  Smartphone,
} from "lucide-react";

import DashboardProgressCard from "./DashboardProgressCard";

type Props = {
  categories?: Record<string, number>;
};

const iconMap = {
  AI: Brain,
  Security: ShieldAlert,
  Software: Code2,
  Cloud: Cloud,
  Mobile: Smartphone,
};

const colorMap = {
  AI: "bg-blue-500",
  Security: "bg-red-500",
  Software: "bg-violet-500",
  Cloud: "bg-cyan-500",
  Mobile: "bg-emerald-500",
};

const bgMap = {
  AI: "bg-blue-500/10",
  Security: "bg-red-500/10",
  Software: "bg-violet-500/10",
  Cloud: "bg-cyan-500/10",
  Mobile: "bg-emerald-500/10",
};

const iconColorMap = {
  AI: "text-blue-500",
  Security: "text-red-500",
  Software: "text-violet-500",
  Cloud: "text-cyan-500",
  Mobile: "text-emerald-500",
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
      color: colorMap[name as keyof typeof colorMap] ?? "bg-blue-500",
      bgColor: bgMap[name as keyof typeof bgMap] ?? "bg-blue-500/10",
      iconColor:
        iconColorMap[name as keyof typeof iconColorMap] ??
        "text-blue-500",
    }));

  return (
    <DashboardProgressCard
      title="Top Categories"
      subtitle="Most active technology topics"
      badge="TOP 5"
      items={items}
    />
  );
}