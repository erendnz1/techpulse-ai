"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LatestNews from "@/components/dashboard/LatestNews";
import AISummary from "@/components/dashboard/AISummary";
import CategoryChart from "@/components/dashboard/CategoryChart";
import RiskChart from "@/components/dashboard/RiskChart";
import TopSources from "@/components/dashboard/TopSources";
import RecentSecurityAlerts from "@/components/dashboard/RecentSecurityAlerts";
import AIActivity from "@/components/dashboard/AIActivity";

type User = {
  id: number;
  username: string;
  email: string;
};

type DashboardStatsType = {
  total_news: number;
  unread_notifications: number;

  categories: Record<string, number>;
  risk_levels: Record<string, number>;
  sources: Record<string, number>;

  ai_articles: number;
  cloud_articles: number;
  critical_alerts: number;

  top_category: string | null;
  top_source: string | null;
};

type NewsItem = {
  id: number;
  title: string;
  summary?: string | null;
  source?: string | null;
  category?: string | null;
  published_at?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [personalizedNews, setPersonalizedNews] = useState<NewsItem[]>([]);

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

      try {
        const [userResponse, statsResponse, newsResponse] =
          await Promise.all([
            fetch(`${apiUrl}/users/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(`${apiUrl}/dashboard/stats`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(`${apiUrl}/news/dashboard?limit=5`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        if (!userResponse.ok) {
          throw new Error("Failed to load user.");
        }

        if (!statsResponse.ok) {
          throw new Error("Failed to load statistics.");
        }

        setUser(await userResponse.json());
        setStats(await statsResponse.json());

        if (newsResponse.ok) {
          setPersonalizedNews(await newsResponse.json());
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Dashboard could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 px-6 py-10 md:px-10">

      <DashboardHeader
        username={user?.username ?? "User"}
        unreadCount={stats?.unread_notifications ?? 0}
      />

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      <DashboardStats stats={stats ?? undefined} />

      {/* Row 1 */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <LatestNews news={personalizedNews} />
        </div>

        <AISummary stats={stats ?? undefined} />

      </div>

      {/* Row 2 */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">

        <CategoryChart
          categories={stats?.categories}
        />

        <RiskChart
          risks={stats?.risk_levels}
        />

        <TopSources
          sources={stats?.sources}
        />

      </div>

      {/* Row 3 */}
      <div className="mt-6 grid items-stretch gap-6 xl:grid-cols-2">

        <RecentSecurityAlerts />

        <AIActivity stats={stats ?? undefined} />

      </div>

    </main>
  );
}