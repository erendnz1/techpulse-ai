"use client";

import {
  Globe,
  GitBranch,
  Newspaper,
  Shield,
  Cpu,
  Cloud,
} from "lucide-react";

type Props = {
  name: string;
  count: number;
};

function getIcon(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("github"))
    return {
      Icon: GitBranch,
      color: "text-gray-600",
      bg: "bg-gray-100",
    };

  if (lower.includes("aws") || lower.includes("cloud"))
    return {
      Icon: Cloud,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    };

  if (
    lower.includes("openai") ||
    lower.includes("anthropic") ||
    lower.includes("hugging")
  )
    return {
      Icon: Cpu,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    };

  if (
    lower.includes("cve") ||
    lower.includes("nvd")
  )
    return {
      Icon: Shield,
      color: "text-red-500",
      bg: "bg-red-500/10",
    };

  if (
    lower.includes("news") ||
    lower.includes("dev.to")
  )
    return {
      Icon: Newspaper,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    };

  return {
    Icon: Globe,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  };
}

export default function SourceCard({
  name,
  count,
}: Props) {
  const { Icon, color, bg } = getIcon(name);

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl dark:border-white/10 dark:bg-white/5">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
          >
            <Icon
              className={`h-6 w-6 ${color} transition-transform duration-300 group-hover:scale-110`}
            />
          </div>

          <div>

            <h3 className="font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>

            <p className="text-sm text-gray-500">
              Technology Source
            </p>

          </div>

        </div>

        <span className="rounded-lg bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-600">
          {count}
        </span>

      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">

        <div
          className="h-full rounded-full bg-blue-500"
          style={{
            width: `${Math.min(count, 100)}%`,
          }}
        />

      </div>

    </div>
  );
}