"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import PlatformHealth from "./components/PlatformHealth";
import QuickActions from "./components/QuickActions";
import Hero from "./components/Hero";
import StatsCards from "./components/StatsCards";
import RecentActivity from "./components/RecentActivity";
import CategoryChart from "./components/charts/CategoryChart";
import RiskChart from "./components/charts/RiskChart";
import NewsTrendChart from "./components/charts/NewsTrendChart";

interface Stats {
  total_users: number;
  total_news: number;
  total_notifications: number;
  ai_articles: number;
  critical_alerts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  async function loadStats() {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load stats.");
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard statistics.");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function fetchNews() {
    const token = localStorage.getItem("access_token");

    const loadingToast = toast.loading("Fetching latest news...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/fetch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Fetch failed.");
      }

      const data = await res.json();

      toast.dismiss(loadingToast);

      toast.success(
        `${data.saved_count} new articles fetched successfully.`
      );

      await loadStats();
    } catch (error) {
      toast.dismiss(loadingToast);

      toast.error("Failed to fetch latest news.");

      console.error(error);
    }
  }

  if (!stats) {
    return (
      <div className="p-8 text-slate-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <Hero />

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart />
        <RiskChart />
      </div>

      <NewsTrendChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlatformHealth />

        <QuickActions onFetch={fetchNews} />
      </div>

      <RecentActivity />
    </div>
  );
}