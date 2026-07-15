"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Globe2,
  Lightbulb,
  Loader2,
  MapPin,
  Newspaper,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";

type NewsDetail = {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
  source: string;
  url: string;
  image_url: string | null;
  author: string | null;
  category: string | null;
  region: string | null;
  importance_score: number | null;
  risk_level: string | null;
  affected_technologies: string[] | null;
  recommended_action: string | null;
  published_at: string | null;
  created_at: string | null;
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();

  const newsId = params.id as string;

  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news/${newsId}`
        );

        if (response.status === 404) {
          throw new Error("News article not found.");
        }

        if (!response.ok) {
          throw new Error("Failed to load news article.");
        }

        const data: NewsDetail = await response.json();

        setNews(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load news article."
        );
      } finally {
        setLoading(false);
      }
    };

    if (newsId) {
      fetchNewsDetail();
    }
  }, [newsId]);

  const getRiskClasses = (riskLevel: string | null) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400";

      case "high":
        return "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400";

      case "medium":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

      case "low":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

      default:
        return "border-gray-300 bg-gray-100 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading news details...</span>
        </div>
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-red-500" />

            <h1 className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">
              Unable to load news
            </h1>

            <p className="mt-2 text-sm text-red-500">
              {error || "News article not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-6 py-10 text-slate-950 dark:text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notifications
        </button>

        {/* Main article */}
        <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
          {news.image_url && (
            <div className="relative h-64 overflow-hidden border-b border-gray-200 dark:border-white/10 md:h-80">
              <img
                src={news.image_url}
                alt={news.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-9">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {news.category && (
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {news.category}
                </span>
              )}

              {news.region && (
                <span className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                  {news.region.toLowerCase() === "turkey" ? (
                    <MapPin className="h-3.5 w-3.5" />
                  ) : (
                    <Globe2 className="h-3.5 w-3.5" />
                  )}

                  {news.region.toLowerCase() === "turkey"
                    ? "Türkiye"
                    : "Global"}
                </span>
              )}

              {news.importance_score !== null && (
                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Importance {news.importance_score}/10
                </span>
              )}

              {news.risk_level && (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${getRiskClasses(
                    news.risk_level
                  )}`}
                >
                  {news.risk_level} Risk
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white md:text-4xl">
              {news.title}
            </h1>

            {/* Metadata */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                {news.source}
              </span>

              {news.published_at && (
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />

                  {new Date(news.published_at).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              )}
            </div>

            {/* AI Summary */}
            <section className="mt-9 rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-5 w-5" />

                <h2 className="font-semibold">
                  AI Summary
                </h2>
              </div>

              <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                {news.summary || "AI summary is not available for this article."}
              </p>
            </section>

            {/* Analysis grid */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Affected technologies */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Wrench className="h-5 w-5 text-purple-500" />

                  <h2 className="font-semibold">
                    Affected Technologies
                  </h2>
                </div>

                {news.affected_technologies &&
                news.affected_technologies.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {news.affected_technologies.map(
                      (technology, index) => (
                        <span
                          key={`${technology}-${index}`}
                          className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400"
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No affected technologies specified.
                  </p>
                )}
              </section>

              {/* Recommended action */}
              <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Lightbulb className="h-5 w-5 text-amber-500" />

                  <h2 className="font-semibold">
                    Recommended Action
                  </h2>
                </div>

                <p className="mt-4 leading-7 text-gray-600 dark:text-gray-300">
                  {news.recommended_action ||
                    "No specific action is recommended for this article."}
                </p>
              </section>
            </div>

            {/* Original content */}
            {news.content && (
              <section className="mt-6 rounded-2xl border border-gray-200 p-6 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />

                  <h2 className="font-semibold text-gray-950 dark:text-white">
                    Article Content
                  </h2>
                </div>

                <p className="mt-4 whitespace-pre-line leading-7 text-gray-600 dark:text-gray-300">
                  {news.content}
                </p>
              </section>
            )}

            {/* Original source button */}
            <div className="mt-8 flex justify-end">
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Read Original Source
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}