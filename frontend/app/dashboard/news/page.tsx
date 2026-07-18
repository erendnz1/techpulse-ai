"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Globe2,
  Loader2,
  Newspaper,
  Sparkles,
  ShieldAlert,
  Brain,
  Cloud,
  Code2,
  Smartphone,
} from "lucide-react";
import NewsCardSkeleton from "@/components/skeletons/NewsCardSkeleton";
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
  image_url?: string | null;
};

type FeedMode = "personalized" | "all";
const PAGE_SIZE = 10;
export default function NewsPage() {
  const router = useRouter();
 const searchParams = useSearchParams();
  const [personalizedNews, setPersonalizedNews] = useState<NewsItem[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);

  const [selectedFeed, setSelectedFeed] =
    useState<FeedMode>("personalized");

  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
const [searchTerm, setSearchTerm] = useState(
  searchParams.get("q") ?? ""
);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


const [personalizedSkip, setPersonalizedSkip] = useState(0);
const [allNewsSkip, setAllNewsSkip] = useState(0);

const [loadingMore, setLoadingMore] = useState(false);

const [hasMorePersonalized, setHasMorePersonalized] =
  useState(true);

const [hasMoreAllNews, setHasMoreAllNews] =
  useState(true);

  useEffect(() => {
  setSearchTerm(searchParams.get("q") ?? "");
}, [searchParams]);
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
  `${apiUrl}/news/personalized?skip=0&limit=${PAGE_SIZE}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(`${apiUrl}/news?skip=0&limit=${PAGE_SIZE}`, {
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
          );setPersonalizedSkip(PAGE_SIZE);
          setHasMorePersonalized(
  personalizedData.length === PAGE_SIZE
);
        } else {
          setPersonalizedNews([]);
        }

        if (allNewsResponse.ok) {
          const allNewsData = await allNewsResponse.json();
          
console.log(allNewsData);
          setAllNews(
            Array.isArray(allNewsData)
              ? allNewsData
              : []
          );setAllNewsSkip(PAGE_SIZE);
          setHasMoreAllNews(
  allNewsData.length === PAGE_SIZE
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
  )
  .filter(
    (item) =>
      selectedCategory === "all" ||
      item.category === selectedCategory
      
  )
  .filter(
  (item) =>
    selectedRisk === "all" ||
    item.risk_level?.toLowerCase() === selectedRisk
)
 .filter((item) => {
  if (!searchTerm.trim()) return true;

  const q = searchTerm.toLowerCase();

  return (
    item.title?.toLowerCase().includes(q) ||
    item.summary?.toLowerCase().includes(q) ||
    item.source?.toLowerCase().includes(q) ||
    item.category?.toLowerCase().includes(q)
  );
})
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
  const getPlaceholder = (category?: string | null) => {
  switch (category) {
    case "AI":
      return {
        icon: Brain,
        title: "AI Update",
        subtitle: "Latest Artificial Intelligence News",
        colors: "from-violet-600 via-purple-700 to-indigo-700",
      };

    case "Security":
      return {
        icon: ShieldAlert,
        title: "Security Alert",
        subtitle: "Latest Cybersecurity Updates",
        colors: "from-red-600 via-red-700 to-orange-700",
      };

    case "Cloud":
      return {
        icon: Cloud,
        title: "Cloud Update",
        subtitle: "Cloud Infrastructure News",
        colors: "from-sky-500 via-blue-600 to-cyan-700",
      };

    case "Developer Tools":
      return {
        icon: Code2,
        title: "Developer Tools",
        subtitle: "Frameworks, IDEs & Dev Tools",
        colors: "from-slate-700 via-slate-800 to-gray-900",
      };

    case "Mobile":
      return {
        icon: Smartphone,
        title: "Mobile Tech",
        subtitle: "Android & iOS Updates",
        colors: "from-emerald-600 via-teal-600 to-cyan-700",
      };

    case "Software":
      return {
        icon: Newspaper,
        title: "Software Update",
        subtitle: "Latest Software Technologies",
        colors: "from-blue-600 via-blue-700 to-indigo-700",
      };
      case "Framework":
  return {
    icon: Code2,
    title: "Framework Update",
    subtitle: "Latest Framework Releases",
    colors: "from-indigo-600 via-violet-700 to-purple-700",
  };

    default:
      return {
        icon: Newspaper,
        title: "Technology News",
        subtitle: "Powered by TechPulse AI",
        colors: "from-blue-600 via-blue-700 to-indigo-700",
      };
  };
};
const loadMore = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return;

  try {
    setLoadingMore(true);

    if (selectedFeed === "personalized") {
      const nextSkip = personalizedSkip;

      const response = await fetch(
        `${apiUrl}/news/personalized?skip=${nextSkip}&limit=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setPersonalizedNews((prev) => [
        ...prev,
        ...data,
      ]);

      setPersonalizedSkip(nextSkip + PAGE_SIZE);

      if (data.length < PAGE_SIZE) {
        setHasMorePersonalized(false);
      }
    } else {
      const nextSkip = allNewsSkip;

      const response = await fetch(
        `${apiUrl}/news?skip=${nextSkip}&limit=${PAGE_SIZE}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setAllNews((prev) => {
  const merged = [...prev, ...data];

  return merged.filter(
    (item, index, self) =>
      index === self.findIndex((n) => n.id === item.id)
  );
});

      setAllNewsSkip(nextSkip + PAGE_SIZE);

      if (data.length < PAGE_SIZE) {
        setHasMoreAllNews(false);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingMore(false);
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
      <div className="mt-8 inline-flex rounded-2xl border border-gray-200 bg-gray-800 p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
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

      
{/* Search */}
<div className="mt-6">
  <input
    type="text"
    placeholder="Search news..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800/60"
  />
</div>
<div className="mt-5 grid gap-3 md:grid-cols-4">

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="
h-12
w-full
rounded-xl
border
border-gray-700
bg-gray-800/60
px-4
text-sm
font-medium
text-white
outline-none
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/20
"
  >
    <option value="all">All Categories</option>
    <option value="AI">AI</option>
    <option value="Security">Security</option>
    <option value="Framework">Framework</option>
    <option value="Developer Tools">Developer Tools</option>
    <option value="Cloud">Cloud</option>
    <option value="DevOps">DevOps</option>
    <option value="Software">Software</option>
    <option value="Mobile">Mobile</option>
    <option value="Business">Business</option>
    <option value="Gaming">Gaming</option>
    <option value="Other">Other</option>
  </select>

  <select
    value={selectedRegion}
    onChange={(e) => setSelectedRegion(e.target.value)}
    className="
h-12
w-full
rounded-xl
border
border-gray-700
bg-gray-800/60
px-4
text-sm
font-medium
text-white
outline-none
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/20
"
  >
    <option value="all">All Regions</option>
    <option value="global">Global</option>
    <option value="turkey">Türkiye</option>
  </select>

  <select
  value={selectedRisk}
  onChange={(e) => setSelectedRisk(e.target.value)}
  className="
h-12
w-full
rounded-xl
border
border-gray-700
bg-gray-800/60
px-4
text-sm
font-medium
text-white
outline-none
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/20
"
>
    <option value="all">All Risk Levels</option>
<option value="critical">Critical</option>
<option value="high">High</option>
<option value="medium">Medium</option>
<option value="low">Low</option>
  </select>

  <select
    className="
h-12
w-full
rounded-xl
border
border-gray-700
bg-gray-800/60
px-4
text-sm
font-medium
text-white
outline-none
transition
focus:border-blue-500
focus:ring-2
focus:ring-blue-500/20
"
  >
    <option>Newest First</option>
    <option>Oldest First</option>
    <option>Highest Importance</option>
  </select>

</div>
      {/* Result count */}
      {!loading && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <span>
  Showing {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""}
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
  <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <NewsCardSkeleton key={index} />
    ))}
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
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => openNewsDetail(item.id)}
              className="group h-full cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
            >
              {(() => {
  const placeholder = getPlaceholder(item.category);
  const Icon = placeholder.icon;

  return (
    <div
      className={`mb-5 flex h-64 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${placeholder.colors} text-white`}
    >
      <Icon className="h-14 w-14 opacity-90" />

      <h3 className="mt-4 text-3xl font-bold tracking-tight">
  {placeholder.title}
</h3>

<p className="mt-2 text-base text-white/80">
  {placeholder.subtitle}
</p>

<div className="mt-6 h-px w-24 bg-white/20" />

<p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/60">
  TechPulse AI
</p>
    </div>
  );
})()}
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
                <h2 className="text-xl  line-clamp-2 font-semibold leading-snug transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
      {!loading &&
  !error &&
  filteredNews.length > 0 && (
    <div className="mt-10 flex justify-center">

      {(selectedFeed === "personalized"
        ? hasMorePersonalized
        : hasMoreAllNews) ? (

        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingMore ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            "Load More"
          )}
        </button>

      ) : (

        <p className="text-sm text-gray-500 dark:text-gray-400">
          You've reached the end.
        </p>

      )}

    </div>
)}
    </main>
  );
}