"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  UserPlus,
  Newspaper,
  Bell,
  ShieldAlert,
} from "lucide-react";

interface ActivityItem {
  type: string;
  title: string;
  created_at: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);

  const displayedActivities = showAll
    ? activities
    : activities.slice(0, 5);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities.");
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "news":
        return {
          icon: Newspaper,
          color: "text-emerald-400",
        };

      case "notification":
        return {
          icon: Bell,
          color: "text-amber-400",
        };

      case "user":
        return {
          icon: UserPlus,
          color: "text-blue-400",
        };

      default:
        return {
          icon: ShieldAlert,
          color: "text-red-400",
        };
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case "news":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";

      case "notification":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";

      case "user":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";

      default:
        return "bg-red-500/15 text-red-400 border-red-500/30";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-xl">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500 bg-slate-800/60 p-6 backdrop-blur-xl">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-10 text-center backdrop-blur-xl">
        <Activity
          size={42}
          className="mx-auto mb-4 text-slate-500"
        />

        <h3 className="text-lg font-semibold text-white">
          No activity yet
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Recent platform events will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-500/15 p-2">
            <Activity
              size={18}
              className="text-indigo-400"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-400">
              Latest platform events
            </p>
          </div>

        </div>

        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
          {showAll
            ? `${activities.length} Events`
            : `${displayedActivities.length}/${activities.length}`}
        </span>

      </div>

      <div className="relative">

        <div className="absolute bottom-0 left-5 top-0 w-px bg-slate-700" />

        <div className="space-y-5">

          {displayedActivities.map((item, index) => {
            const { icon: Icon, color } = getIcon(item.type);

            return (
              <div
                key={`${item.type}-${index}`}
                className="relative flex gap-4"
              >

                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900 shadow-lg shadow-slate-950">
                  <Icon
                    size={18}
                    className={color}
                  />
                </div>

                <div className="flex-1 rounded-xl border border-slate-700 bg-slate-900/40 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:bg-slate-900/70">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <div className="mt-2">

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getBadge(
                            item.type
                          )}`}
                        >
                          {item.type}
                        </span>

                      </div>

                    </div>

                    <span className="whitespace-nowrap text-xs text-slate-500">
                      {formatDistanceToNow(
                        new Date(item.created_at),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {activities.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-6 w-full rounded-xl border border-slate-700 bg-slate-900/40 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800 hover:text-white"
        >
          {showAll ? "Show Less" : "Load More"}
        </button>
      )}

    </div>
  );
}