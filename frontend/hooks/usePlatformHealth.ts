"use client";

import { useEffect, useState } from "react";

export interface PlatformHealth {
  backend: boolean;
  database: boolean;
  scheduler: boolean;
  ai: boolean;
  news_sources: number;
}

export function usePlatformHealth() {
  const [data, setData] = useState<PlatformHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHealth() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/health`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch platform health.");
        }

        const json = await response.json();

        setData(json);
      } catch (error) {
        console.error("Health fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHealth();
  }, []);

  return {
    data,
    loading,
  };
}