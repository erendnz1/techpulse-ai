"use client";

import { useEffect, useState } from "react";
import { Rocket, ChevronRight } from "lucide-react";
import Link from "next/link";

type Release = {
  id: number;
  title: string;
  source: string;
  published_at?: string;
};

export default function LatestReleases() {
  const [items, setItems] = useState<Release[]>([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/news/releases?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      setItems(await res.json());
    };

    load();
  }, []);

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/5">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Rocket className="h-5 w-5 text-cyan-500" />
            Latest Releases
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            GitHub & framework updates
          </p>

        </div>

        <Link
          href="/dashboard/news"
          className="flex items-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>

      </div>

      <div className="space-y-4">

        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 p-4 transition hover:border-cyan-300 hover:bg-cyan-50/40 dark:border-white/10 dark:hover:bg-white/5"
          >
            <p className="line-clamp-2 text-sm font-semibold">
              {item.title}
            </p>

            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{item.source}</span>

              <span>
                {item.published_at
                  ? new Date(item.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : ""}
              </span>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}