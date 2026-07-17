"use client";

import { Globe } from "lucide-react";

type TopSourcesProps = {
  sources?: Record<string, number>;
};

export default function TopSources({
  sources,
}: TopSourcesProps) {
  if (!sources) return null;

  const items = Object.entries(sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const max = items[0]?.[1] ?? 1;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">

      <div className="mb-5">
        <h3 className="flex items-center gap-2 text-xl font-bold">
          <Globe className="h-5 w-5 text-cyan-500" />
          Top Sources
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Most active providers
        </p>
      </div>

      <div className="space-y-4">
        {items.map(([source, count]) => (
          <div key={source}>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium">
                {source}
              </span>

              <span className="text-sm text-gray-500">
                {count}
              </span>

            </div>

            <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10">

              <div
                className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                style={{
                  width: `${(count / max) * 100}%`,
                }}
              />

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}