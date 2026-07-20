"use client";

import Link from "next/link";
import {
  Globe,
  GitBranch,
  Newspaper,
  Shield,
  Cpu,
  Cloud,
} from "lucide-react";

import DashboardProgressCard from "./DashboardProgressCard";

type Props = {
  sources?: Record<string, number>;
};

const getSourceConfig = (source: string) => {
  const name = source.toLowerCase();

  if (name.includes("github")) {
    return {
      icon: GitBranch,
      color: "bg-gray-700",
      bgColor: "bg-gray-500/10",
      iconColor: "text-gray-700 dark:text-gray-300",
    };
  }

  if (
    name.includes("nvd") ||
    name.includes("cve") ||
    name.includes("hacker")
  ) {
    return {
      icon: Shield,
      color: "bg-red-500",
      bgColor: "bg-red-500/10",
      iconColor: "text-red-500",
    };
  }

  if (
    name.includes("aws") ||
    name.includes("cloud") ||
    name.includes("azure")
  ) {
    return {
      icon: Cloud,
      color: "bg-cyan-500",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    };
  }

  if (
    name.includes("openai") ||
    name.includes("anthropic") ||
    name.includes("hugging")
  ) {
    return {
      icon: Cpu,
      color: "bg-violet-500",
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    };
  }

  if (
    name.includes("news") ||
    name.includes("dev.to") ||
    name.includes("donanım") ||
    name.includes("shift")
  ) {
    return {
      icon: Newspaper,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    };
  }

  return {
    icon: Globe,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  };
};

export default function TopSources({ sources }: Props) {
  const items = Object.entries(sources ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value]) => {
      const config = getSourceConfig(label);

      return {
        label,
        value,
        icon: config.icon,
        color: config.color,
        bgColor: config.bgColor,
        iconColor: config.iconColor,
      };
    });

  return (
    <DashboardProgressCard
      title="Top Sources"
      subtitle="Most active technology news providers"
      badge={`${Object.keys(sources ?? {}).length} Sources`}
      items={items}
      footer={
        <Link
          href="/dashboard/sources"
          className="flex items-center justify-center rounded-lg py-2 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-500 dark:text-blue-400"
        >
          View All Sources →
        </Link>
      }
    />
  );
}