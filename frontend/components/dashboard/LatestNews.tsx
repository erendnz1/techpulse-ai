"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Newspaper } from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  summary?: string | null;
  source?: string | null;
  category?: string | null;
  published_at?: string | null;
};

type LatestNewsProps = {
  news: NewsItem[];
};

function badgeColor(category?: string | null) {
  switch (category) {
    case "AI":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
    case "Security":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
    case "Cloud":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300";
    case "Developer Tools":
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
  }
}

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function LatestNews({ news }: LatestNewsProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">

      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />

          <h2 className="text-lg font-semibold">
            Latest Technology News
          </h2>
        </div>

        <Link
          href="/dashboard/news"
          className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>

      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/10">

        {news.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No news available.
          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/dashboard/news/${item.id}`)}
              className="cursor-pointer py-3 transition hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="mb-1 flex items-center gap-2">

                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor(
                    item.category
                  )}`}
                >
                  {item.category ?? "Other"}
                </span>

                <span className="text-xs text-gray-500">
                  {item.source ?? "Unknown"} • {formatDate(item.published_at)}
                </span>

              </div>

              <h3 className="line-clamp-1 text-sm font-semibold">
                {item.title}
              </h3>

            </div>
          ))
        )}

      </div>

    </div>
  );
}