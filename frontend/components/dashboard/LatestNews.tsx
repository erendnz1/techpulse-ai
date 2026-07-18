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
      return "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300";

    case "Security":
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";

    case "Cloud":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300";

    case "Developer Tools":
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300";

    case "Framework":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";

    case "Software":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300";

    case "Business":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";

    case "Gaming":
      return "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300";

    case "Mobile":
      return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";

    default:
      return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
  }
}

function formatDate(date?: string | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LatestNews({ news }: LatestNewsProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />

          <h2 className="text-lg font-semibold">
            Latest Technology News
          </h2>
        </div>

        <Link
          href="/dashboard/news"
          className="group flex items-center gap-1 text-sm font-medium text-blue-500 transition-colors hover:text-blue-600"
        >
          View All

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/10">

        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">

            <Newspaper className="mb-3 h-10 w-10 text-gray-400" />

            <p className="text-sm font-medium text-gray-500">
              No technology news available
            </p>

          </div>
        ) : (
          news.map((item) => (
            <div
              key={item.id}
              onClick={() => router.push(`/dashboard/news/${item.id}`)}
              className="group cursor-pointer rounded-xl px-2 py-3 transition-all duration-200 hover:bg-blue-500/5"
            >
              <div className="mb-2 flex items-center gap-2">

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeColor(
                    item.category
                  )}`}
                >
                  {item.category ?? "Other"}
                </span>

                <span className="text-xs text-gray-500">
                  {item.source ?? "Unknown"} • {formatDate(item.published_at)}
                </span>

              </div>

              <h3 className="line-clamp-2 text-sm font-semibold leading-6 transition-colors group-hover:text-blue-500">
                {item.title}
              </h3>

            </div>
          ))
        )}

      </div>

    </div>
  );
}