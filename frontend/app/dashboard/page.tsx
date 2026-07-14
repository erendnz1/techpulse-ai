"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";
export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
const [news, setNews] = useState<any[]>([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        return res.json();
      })
      .then((data) => {
        setUser(data);

        fetch("http://localhost:8000/dashboard/stats", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
  
})
  .then((res) => res.json())
  .then((data) => {
    setStats(data);
  });

  fetch("http://localhost:8000/news", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((res) => res.json())
  .then((data) => {
    setNews(data);
  });
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        router.push("/login");
      });
  }, [router]);

  return (
  
        
<div className="min-w-0 flex-1 px-6 py-10 md:px-10">
      <header className="mb-10 flex items-center justify-between">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">
      TechPulse <span className="text-blue-600">AI</span>
    </h1>

    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      Welcome back, {user?.username || "User"}
    </p>
  </div>

  <div className="flex items-center gap-3">
  <ThemeToggle />

  <button
    onClick={() => {
      localStorage.removeItem("access_token");
      router.push("/login");
    }}
    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
  >
    Logout
  </button>
</div>
</header>


      {stats && (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

    <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Total News
      </p>

      <p className="mt-3 text-4xl font-bold tracking-tight">
        {stats.total_news}
      </p>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Technology updates tracked
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Unread Notifications
      </p>

      <p className="mt-3 text-4xl font-bold tracking-tight">
        {stats.unread_notifications}
      </p>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Alerts waiting for your attention
      </p>
    </div>

  </div>
)}
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
      {Object.entries(stats.categories).map(([category, count]) => (
        <div
          key={category}
          className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {category}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight">
            {count as number}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
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
      {Object.entries(stats.risk_levels).map(([risk, count]) => (
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
            {count as number}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
{news.length > 0 && (
  <section className="mt-10">
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Latest Technology News
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Latest technology updates analyzed by AI
      </p>
    </div>

    <div className="grid gap-5">
      {news
        .filter((item) => !item.title?.toUpperCase().startsWith("CVE-"))
        .slice(0, 5)
        .map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                {item.category || "Other"}
              </span>

              {item.importance_score && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Importance: {item.importance_score}/10
                </span>
              )}

              {item.risk_level && (
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      item.risk_level === "Critical"
        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
        : item.risk_level === "High"
          ? "bg-red-500/10 text-red-600 dark:text-red-400"
          : item.risk_level === "Medium"
            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "bg-green-500/10 text-green-600 dark:text-green-400"
    }`}
  >
    Risk: {item.risk_level}
  </span>
)}
            </div>

            <h3 className="text-lg font-semibold leading-snug">
              {item.title}
            </h3>

            <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
              {item.summary || "No summary available."}
            </p>
          </article>
        ))}
    </div>
  </section>
)}
{news.some((item) =>
  item.title?.toUpperCase().startsWith("CVE-")
) && (
  <section className="mt-10">
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">
        Security Alerts
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Latest security vulnerabilities detected and analyzed by AI
      </p>
    </div>

    <div className="grid gap-5">
      {news
        .filter((item) =>
          item.title?.toUpperCase().startsWith("CVE-")
        )
        .slice(0, 5)
        .map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-red-500/20 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg dark:bg-gray-800/60"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400">
                Security Vulnerability
              </span>

              {item.risk_level && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    item.risk_level === "Critical"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : item.risk_level === "High"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : item.risk_level === "Medium"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-green-500/10 text-green-600 dark:text-green-400"
                  }`}
                >
                  Risk: {item.risk_level}
                </span>
              )}

              {item.importance_score && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Importance: {item.importance_score}/10
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold leading-snug">
              {item.title}
            </h3>

            <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
              {item.summary || "No summary available."}
            </p>

            {item.affected_technologies && (
              <div className="mt-5 rounded-xl bg-gray-100/80 p-4 dark:bg-gray-900/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Affected Technologies
                </p>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {item.affected_technologies}
                </p>
              </div>
            )}

            {item.recommended_action && (
              <div className="mt-3 rounded-xl bg-blue-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Recommended Action
                </p>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {item.recommended_action}
                </p>
              </div>
            )}
          </article>
        ))}
    </div>
  </section>
)}


  </div>
);
}