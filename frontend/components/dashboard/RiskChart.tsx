"use client";

import {
  ShieldX,
  ShieldAlert,
  Shield,
  ShieldCheck,
  CircleOff,
} from "lucide-react";

import DashboardProgressCard from "./DashboardProgressCard";

type RiskLevel = "Critical" | "High" | "Medium" | "Low" | "None";

type Props = {
  risks?: Partial<Record<RiskLevel, number>>;
};

const riskLevels: RiskLevel[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
  "None",
];

const iconMap = {
  Critical: ShieldX,
  High: ShieldAlert,
  Medium: Shield,
  Low: ShieldCheck,
  None: CircleOff,
};

const colorMap = {
  Critical: "bg-purple-500",
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
  None: "bg-slate-500",
};

const bgMap = {
  Critical: "bg-purple-500/10",
  High: "bg-red-500/10",
  Medium: "bg-yellow-500/10",
  Low: "bg-green-500/10",
  None: "bg-slate-500/10",
};

const iconColorMap = {
  Critical: "text-purple-500",
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
  None: "text-slate-500",
};

export default function RiskChart({ risks = {} }: Props) {
  const items = riskLevels
    .map((level) => ({
      label: level,
      value: risks[level] ?? 0,
      icon: iconMap[level],
      color: colorMap[level],
      bgColor: bgMap[level],
      iconColor: iconColorMap[level],
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <DashboardProgressCard
      title="Risk Levels"
      subtitle="Current security status"
      badge="LIVE"
      items={items}
    />
  );
}