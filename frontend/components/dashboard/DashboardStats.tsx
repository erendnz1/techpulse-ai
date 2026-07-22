"use client";

import {
  Bell,
  Globe2,
  Newspaper,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import StatCard from "./StatCard";


type DashboardStatsProps = {
  stats?: {
    total_news: number;
    unread_notifications: number;
    risk_levels: Record<string, number>;
    sources?: Record<string, number>;
  };
};


export default function DashboardStats({
  stats,
}: DashboardStatsProps) {

  return (

    <section
      className="
        mt-5
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-5
      "
    >


      <StatCard
        title="Today's News"
        value={stats?.total_news ?? "--"}
        subtitle="Technology updates"
        icon={Newspaper}
        iconBg="bg-blue-500/15"
        iconColor="text-blue-500"
        trend="+12%"
        trendColor="text-green-500"
      />



      <StatCard
        title="AI Summarized"
        value={stats?.total_news ?? "--"}
        subtitle="AI analyzed"
        icon={Sparkles}
        iconBg="bg-green-500/15"
        iconColor="text-green-500"
        trend="100%"
        trendColor="text-green-500"
      />



      <StatCard
        title="Critical Alerts"
        value={stats?.risk_levels?.Critical ?? 0}
        subtitle="High priority"
        icon={ShieldAlert}
        iconBg="bg-red-500/15"
        iconColor="text-red-500"
        trend="Security"
        trendColor="text-red-500"
      />



      <StatCard
        title="Notifications"
        value={stats?.unread_notifications ?? "--"}
        subtitle="Unread"
        icon={Bell}
        iconBg="bg-purple-500/15"
        iconColor="text-purple-500"
        trend="Live"
        trendColor="text-purple-500"
      />



      <StatCard
        title="Sources"
        value={
          Object.keys(
            stats?.sources ?? {}
          ).length
        }
        subtitle="Active providers"
        icon={Globe2}
        iconBg="bg-cyan-500/15"
        iconColor="text-cyan-500"
        trend="Online"
        trendColor="text-cyan-500"
      />


    </section>

  );
}