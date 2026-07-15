"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Globe2,
  Loader2,
  Newspaper,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { ThemeToggle } from "../theme-toggle";

type User = {
  id: number;
  username: string;
  email: string;
};

type DashboardStats = {
  total_news: number;
  unread_notifications: number;
  categories: Record<string, number>;
  risk_levels: Record<string, number>;
  sources?: Record<string, number>;
};

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
  affected_technologies?: string[] | string | null;
  recommended_action?: string | null;
  published_at?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [personalizedNews, setPersonalizedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
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

        const userResponse = await fetch(
          `${apiUrl}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userResponse.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/login");
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Failed to load user information.");
        }

        const userData = await userResponse.json();
        setUser(userData);

        const [
          statsResponse,
          personalizedResponse,
          latestNewsResponse,
        ] = await Promise.all([
          fetch(`${apiUrl}/dashboard/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${apiUrl}/news/personalized?limit=20`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${apiUrl}/news?limit=100`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!statsResponse.ok) {
          throw new Error("Failed to load dashboard statistics.");
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        if (personalizedResponse.ok) {
          const personalizedData =
            await personalizedResponse.json();

          setPersonalizedNews(
            Array.isArray(personalizedData)
              ? personalizedData
              : []
          );
        } else if (personalizedResponse.status === 404) {
          router.replace("/onboarding");
          return;
        } else {
          setPersonalizedNews([]);
        }

        if (latestNewsResponse.ok) {
          const latestData = await latestNewsResponse.json();

          setLatestNews(
            Array.isArray(latestData) ? latestData : []
          );
        } else {
          setLatestNews([]);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const openNewsDetail = (newsId: number) => {
    router.push(`/dashboard/news/${newsId}`);
  };

  const getRiskClasses = (
    riskLevel: string | null | undefined
  ) => {
    switch (riskLevel?.toLowerCase()) {
      case "critical":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";

      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400";

      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

      case "low":
        return "bg-green-500/10 text-green-600 dark:text-green-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const personalizedPreview = personalizedNews.slice(0, 5);

  const securityAlerts = latestNews
    .filter(
      (item) =>
        item.category === "Security" ||
        item.title?.toUpperCase().startsWith("CVE-")
    )
    .slice(0, 5);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-10">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />

          <span>Loading your dashboard...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
      {/* Header */}
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            TechPulse{" "}
            <span className="text-blue-600">AI</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.username || "User"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Main stats */}
      {stats && (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total News
              </p>

              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                <Newspaper className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-4xl font-bold tracking-tight">
              {stats.total_news}
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Technology updates tracked
            </p>
          </div>

          <div
            onClick={() =>
              router.push("/dashboard/notifications")
            }
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Unread Notifications
              </p>

              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-600 dark:text-purple-400">
                <Bell className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-4xl font-bold tracking-tight">
              {stats.unread_notifications}
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Alerts waiting for your attention
            </p>
          </div>
        </section>
      )}

      {/* Personalized feed */}
      <section className="mt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />

              <h2 className="text-2xl font-bold tracking-tight">
                Recommended for You
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Technology updates selected based on your
              interests, regions and importance preferences
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/dashboard/news")}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all personalized news
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {personalizedPreview.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
            <Sparkles className="mx-auto h-8 w-8 text-gray-400" />

            <h3 className="mt-4 font-semibold">
              No personalized news found
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
              No current news matches your selected categories,
              regions and minimum importance score. You can update
              your preferences at any time.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/preferences")
              }
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Update Preferences
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {personalizedPreview.map((item) => (
              <article
                key={item.id}
                onClick={() => openNewsDetail(item.id)}
                className="group cursor-pointer rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                    {item.category || "Other"}
                  </span>

                  {item.region && (
                    <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <Globe2 className="h-3.5 w-3.5" />

                      {item.region.toLowerCase() === "turkey"
                        ? "Türkiye"
                        : "Global"}
                    </span>
                  )}

                  {item.importance_score !== null &&
                    item.importance_score !== undefined && (
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                        Importance: {item.importance_score}/10
                      </span>
                    )}

                  {item.risk_level && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskClasses(
                        item.risk_level
                      )}`}
                    >
                      Risk: {item.risk_level}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold leading-snug transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 leading-7 text-gray-600 dark:text-gray-300">
                      {item.summary || "No summary available."}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-500 dark:text-gray-600" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Category Distribution */}
      {stats?.categories && (
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Category Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              News distribution across technology categories
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Object.entries(stats.categories).map(
              ([category, count]) => (
                <div
                  key={category}
                  className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
                >
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {category}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight">
                    {count}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Risk Distribution */}
      {stats?.risk_levels && (
        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Risk Level Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Security risk levels detected across analyzed news
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Object.entries(stats.risk_levels).map(
              ([risk, count]) => (
                <div
                  key={risk}
                  className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {risk}
                    </p>

                    <span
                      className={`h-3 w-3 rounded-full ${
                        risk === "Critical"
                          ? "bg-purple-500"
                          : risk === "High"
                            ? "bg-red-500"
                            : risk === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                    />
                  </div>

                  <p className="mt-3 text-3xl font-bold tracking-tight">
                    {count}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Security Alerts */}
      <section className="mt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />

              <h2 className="text-2xl font-bold tracking-tight">
                Latest Security Alerts
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Latest security vulnerabilities and data breaches
              detected by TechPulse AI
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/security-alerts")
            }
            className="flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            View all security alerts
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {securityAlerts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
            <ShieldAlert className="mx-auto h-8 w-8 text-gray-400" />

            <p className="mt-4 font-medium">
              No security alerts found.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {securityAlerts.map((item) => (
              <article
                key={item.id}
                onClick={() => openNewsDetail(item.id)}
                className="group cursor-pointer rounded-2xl border border-red-500/20 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg dark:bg-gray-800/60"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {item.source === "KVKK"
                      ? "Data Breach"
                      : "Security Vulnerability"}
                  </span>

                  {item.region && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {item.region.toLowerCase() === "turkey"
                        ? "Türkiye"
                        : "Global"}
                    </span>
                  )}

                  {item.risk_level && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getRiskClasses(
                        item.risk_level
                      )}`}
                    >
                      Risk: {item.risk_level}
                    </span>
                  )}

                  {item.importance_score !== null &&
                    item.importance_score !== undefined && (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        Importance: {item.importance_score}/10
                      </span>
                    )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold leading-snug transition group-hover:text-red-600 dark:group-hover:text-red-400">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 leading-7 text-gray-600 dark:text-gray-300">
                      {item.summary || "No summary available."}
                    </p>
                  </div>

                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-500 dark:text-gray-600" />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}