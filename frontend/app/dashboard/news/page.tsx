"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe2,
  Loader2,
  Newspaper,
  Sparkles,
} from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  content?: string | null;
  summary?: string | null;
  source?: string | null;
  url?: string | null;
  category?: string | null;
  region?: string | null;
  importance_score?: number | null;
  risk_level?: string | null;
  published_at?: string | null;
};

type FeedMode = "personalized" | "all";

export default function NewsPage() {
  const router = useRouter();

  const [personalizedNews, setPersonalizedNews] = useState<NewsItem[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);

  const [selectedFeed, setSelectedFeed] =
    useState<FeedMode>("personalized");

  const [selectedRegion, setSelectedRegion] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      const token = localStorage.getItem("access_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!token) {
        router.replace("/login");
        return;
      }

      if (!apiUrl) {
        setError("API URL is not configured.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          personalizedResponse,
          allNewsResponse,
        ] = await Promise.all([
          fetch(
            `${apiUrl}/news/personalized?limit=100`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(`${apiUrl}/news?limit=100`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (personalizedResponse.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/login");
          return;
        }

        if (personalizedResponse.status === 404) {
          router.replace("/onboarding");
          return;
        }

        if (personalizedResponse.ok) {
          const personalizedData =
            await personalizedResponse.json();

          setPersonalizedNews(
            Array.isArray(personalizedData)
              ? personalizedData
              : []
          );
        } else {
          setPersonalizedNews([]);
        }

        if (allNewsResponse.ok) {
          const allNewsData = await allNewsResponse.json();

          setAllNews(
            Array.isArray(allNewsData)
              ? allNewsData
              : []
          );
        } else {
          setAllNews([]);
        }
      } catch (error) {
        console.error("News fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load news."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [router]);

  const currentNews =
    selectedFeed === "personalized"
      ? personalizedNews
      : allNews;

  const filteredNews = currentNews
    .filter(
      (item) =>
        !item.title?.toUpperCase().startsWith("CVE-")
    )
    .filter(
      (item) =>
        selectedRegion === "all" ||
        item.region?.toLowerCase() === selectedRegion
    );

  const getRiskClasses = (
    riskLevel: string | null | undefined
  ) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

      case "medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "low":
        return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const openNewsDetail = (newsId: number) => {
    router.push(`/dashboard/news/${newsId}`);
  };

  return (
    <main className="min-h-screen bg-transparent p-6 text-slate-950 dark:text-white md:p-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          News
        </h1>

        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Explore AI-analyzed technology news and personalized
          updates based on your interests.
        </p>
      </div>

      {/* Feed tabs */}
      <div className="mt-8 inline-flex rounded-2xl border border-gray-200 bg-white/70 p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <button
          type="button"
          onClick={() => {
            setSelectedFeed("personalized");
            setSelectedRegion("all");
          }}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            selectedFeed === "personalized"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          For You
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedFeed("all");
            setSelectedRegion("all");
          }}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
            selectedFeed === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          }`}
        >
          <Newspaper className="h-4 w-4" />
          All News
        </button>
      </div>

      {/* Active feed explanation */}
      <div className="mt-5 rounded-2xl border border-blue-500/15 bg-blue-500/[0.05] px-5 py-4">
        <div className="flex items-start gap-3">
          {selectedFeed === "personalized" ? (
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          ) : (
            <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          )}

          <div>
            <p className="font-medium text-gray-800 dark:text-gray-100">
              {selectedFeed === "personalized"
                ? "Your personalized technology feed"
                : "All technology news"}
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {selectedFeed === "personalized"
                ? "Showing news that matches your selected categories, regions and minimum importance score."
                : "Showing all available technology news collected and analyzed by TechPulse AI."}
            </p>
          </div>
        </div>
      </div>

      {/* Region filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { label: "All Regions", value: "all" },
          { label: "Global", value: "global" },
          { label: "Türkiye", value: "turkey" },
        ].map((region) => (
          <button
            key={region.value}
            type="button"
            onClick={() =>
              setSelectedRegion(region.value)
            }
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              selectedRegion === region.value
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      {!loading && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <span>
            {filteredNews.length} articles found
          </span>

          {selectedFeed === "personalized" && (
            <>
              <span>•</span>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/preferences")
                }
                className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Update your preferences
              </button>
            </>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-12 flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading technology news...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredNews.length === 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
          {selectedFeed === "personalized" ? (
            <Sparkles className="mx-auto h-8 w-8 text-gray-400" />
          ) : (
            <Newspaper className="mx-auto h-8 w-8 text-gray-400" />
          )}

          <p className="mt-4 font-medium text-gray-700 dark:text-gray-200">
            No articles found.
          </p>

          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            {selectedFeed === "personalized"
              ? "No current articles match your selected categories, regions and minimum importance score."
              : "There are currently no technology articles available for this region."}
          </p>

          {selectedFeed === "personalized" && (
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/preferences")
              }
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Update Preferences
            </button>
          )}
        </div>
      )}

      {/* News cards */}
      {!loading && !error && filteredNews.length > 0 && (
        <div className="mt-8 grid gap-5">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => openNewsDetail(item.id)}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
            >
              {/* Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {item.category || "Other"}
                </span>

                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                  {item.region?.toLowerCase() === "turkey"
                    ? "Türkiye"
                    : "Global"}
                </span>

                {item.importance_score !== null &&
                  item.importance_score !== undefined && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      Importance {item.importance_score}/10
                    </span>
                  )}

                {item.risk_level && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskClasses(
                      item.risk_level
                    )}`}
                  >
                    {item.risk_level} Risk
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold leading-snug transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.title}
                </h2>

                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-500 dark:text-gray-600" />
              </div>

              {/* Summary */}
              <p className="mt-3 line-clamp-3 leading-7 text-gray-600 dark:text-gray-300">
                {item.summary || "No summary available."}
              </p>

              {/* Footer */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Source: {item.source || "Unknown"}
                  </span>

                  {item.published_at && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Published:{" "}
                      {new Date(
                        item.published_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-600 transition group-hover:text-blue-700 dark:text-blue-400">
                    View AI analysis →
                  </span>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      Read original ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}