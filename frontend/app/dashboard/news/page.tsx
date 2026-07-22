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
  Terminal,
  AppWindow,
  Blocks,
  Smartphone,
  Briefcase,
  Gamepad2,
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
  const [sortBy, setSortBy] = useState("newest");
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
        const params = new URLSearchParams();

params.append("skip", "0");
params.append("limit", PAGE_SIZE.toString());

if (selectedCategory !== "all") {
  params.append("category", selectedCategory);
}

if (selectedRegion !== "all") {
  params.append("region", selectedRegion);
}

if (selectedRisk !== "all") {
  params.append("risk_level", selectedRisk);
}

if (searchTerm.trim()) {
  params.append("search", searchTerm);
}
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

          fetch(
  `${apiUrl}/news?${params.toString()}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
),
         
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
          
          const personalizedData = await personalizedResponse.json();

          console.log("INITIAL PERSONALIZED:", personalizedData);

          setPersonalizedNews(
            Array.isArray(personalizedData)
             ? personalizedData
              : []
            );
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
    }, [
  router,
  selectedFeed,
  selectedCategory,
  selectedRegion,
  selectedRisk,
  searchTerm,
]);

  const currentNews =
    selectedFeed === "personalized"
      ? personalizedNews
      : allNews;

  const filteredNews = currentNews.filter((item) => {
  // All News'ta CVE'leri gizle
  if (
    selectedFeed === "all" &&
    item.title?.toUpperCase().startsWith("CVE-")
  ) {
    return false;
  }

  // Search
  if (
    searchTerm.trim() &&
    !(
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) {
    return false;
  }

  // Category
  if (
    selectedCategory !== "all" &&
    item.category !== selectedCategory
  ) {
    return false;
  }

  // Region
  if (
    selectedRegion !== "all" &&
    item.region?.toLowerCase() !== selectedRegion.toLowerCase()
  ) {
    return false;
  }

  // Risk
  if (
    selectedRisk !== "all" &&
    item.risk_level?.toLowerCase() !== selectedRisk.toLowerCase()
  ) {
    return false;
  }

  return true;
}); const sortedNews = (() => {
  switch (sortBy) {
    case "oldest":
      return [...filteredNews].sort(
        (a, b) =>
          new Date(a.published_at ?? "").getTime() -
          new Date(b.published_at ?? "").getTime()
      );

    case "importance":
      return [...filteredNews].sort(
        (a, b) =>
          (b.importance_score ?? 0) -
          (a.importance_score ?? 0)
      );

    case "risk": {
      const order = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };

      return [...filteredNews].sort(
        (a, b) =>
          (order[
            b.risk_level?.toLowerCase() as keyof typeof order
          ] ?? 0) -
          (order[
            a.risk_level?.toLowerCase() as keyof typeof order
          ] ?? 0)
      );
    }

    case "newest":
    default:
      // API'nin döndürdüğü sıralamayı koru
      return filteredNews;
  }
})();
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
    label: "AI",
    colors:
        "from-violet-600 via-fuchsia-600 to-indigo-700",
    glow:
        "bg-violet-500/30",
};

    case "Security":
      return {
    icon: ShieldAlert,
    label: "Security",
    colors:
        "from-red-700 via-red-600 to-orange-600",
    glow:
        "bg-red-500/30",
};

    case "Cloud":
      return {
        icon: Cloud,
        label: "Cloud",
        colors: "from-sky-500 via-blue-600 to-cyan-700",
        glow: "bg-sky-500/30",
      };

    case "Developer Tools":
      return {
        icon: Terminal,
        label: "Developer Tools",
        colors: "from-slate-700 via-slate-800 to-gray-900",
        glow: "bg-slate-500/30",
      };

    case "Mobile":
      return {
        icon: Smartphone,
        label: "Mobile",
        colors: "from-emerald-600 via-teal-600 to-cyan-700",
        glow: "bg-emerald-500/30",
      };


    case "Software":
      return {
        icon: AppWindow,
        label: "Software",
        colors: "from-blue-600 via-blue-700 to-indigo-700",
        glow: "bg-blue-500/30",
      };

    case "Framework":
      return {
        icon: Blocks,
        label: "Framework",
        colors: "from-indigo-600 via-violet-700 to-purple-700",
        glow: "bg-indigo-500/30",
      };


    case "Business":
      return {
        icon: Briefcase,
        label: "Business",
        colors: "from-amber-600 via-orange-700 to-yellow-700",
        glow: "bg-amber-500/30",
      };

    case "Gaming":
      return {
        icon: Gamepad2,
        title: "Gaming Update",
        subtitle: "Latest Gaming News",
        colors: "from-pink-600 via-rose-700 to-fuchsia-700",
        glow: "bg-pink-500/30",
      };

    default:
      return {
        icon: Newspaper,
        label: "Technology",
        colors: "from-blue-600 via-blue-700 to-indigo-700",
        glow: "bg-blue-500/30",
      };
  }
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
      console.log("Personalized API:", data);
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

  const params = new URLSearchParams();

  params.append("skip", nextSkip.toString());
  params.append("limit", PAGE_SIZE.toString());

  if (selectedCategory !== "all") {
    params.append("category", selectedCategory);
  }

  if (selectedRegion !== "all") {
    params.append("region", selectedRegion);
  }

  if (selectedRisk !== "all") {
    params.append("risk_level", selectedRisk);
  }

  if (searchTerm.trim()) {
    params.append("search", searchTerm);
  }

  const response = await fetch(
    `${apiUrl}/news?${params.toString()}`,
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
    <main className="min-h-screen bg-transparent px-4 py-4 text-slate-950 dark:text-white sm:px-6 md:px-8 lg:px-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          News
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          Explore AI-analyzed technology news and personalized
          updates based on your interests.
        </p>
      </div>

      {/* Feed tabs */}
      <div className="mt-6 flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-800 p-1.5 shadow-sm sm:inline-flex sm:w-auto sm:flex-row dark:border-gray-700 dark:bg-gray-800/60">
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
          <Sparkles className=" flex flex-1 items-center justify-center h-4 w-4" />
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
          <Newspaper className="flex flex-1 items-center justify-center h-4 w-4" />
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
<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

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
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
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
<option value="newest">Recommend</option>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="importance">Highest Importance</option>
  <option value="risk">Highest Risk</option>
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
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {sortedNews.map((item) => (
            <article
              key={item.id}
              onClick={() => openNewsDetail(item.id)}
              className="group h-full cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-4 sm:p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
            >
              {(() => {
  const placeholder = getPlaceholder(item.category);
  const Icon = placeholder.icon;

  return (
    <div
      className={`relative mb-5 h-44 sm:h-64 overflow-hidden rounded-2xl bg-gradient-to-br ${placeholder.colors}`}
    >
      {/* Glow */}
      <div
        className={`absolute -left-16 -top-16 h-56 w-56 rounded-full blur-3xl ${placeholder.glow}`}
      />

      <div
        className={`absolute -right-16 bottom-0 h-56 w-56 rounded-full blur-3xl ${placeholder.glow}`}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top badge */}
      <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
        {placeholder.label}
      </div>

      {/* Center */}
      <div className="relative flex h-full flex-col items-center justify-center">

        <div className="rounded-full border border-white/20 bg-white/10 p-6 backdrop-blur-md">
          <Icon className="h-14 w-14 text-white drop-shadow-xl" />
        </div>

        <div className="mt-8 text-xs uppercase tracking-[0.35em] text-white/70">
          TechPulse AI
        </div>

      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
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
                <h2 className="text-lg sm:text-xl  line-clamp-2 font-semibold leading-snug transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
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
          className="w-full rounded-xl bg-blue-600 px-6 py-3 sm:w-auto text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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