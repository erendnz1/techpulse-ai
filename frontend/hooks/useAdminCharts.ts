"use client";

import { useEffect, useState } from "react";

export interface ChartData {
  categories: {
    name: string;
    value: number;
  }[];

  risk_levels: {
    name: string;
    value: number;
  }[];

  daily_news: {
    date: string;
    count: number;
  }[];
}

export function useAdminCharts() {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharts() {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/charts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data.");
        }

        const json = await response.json();

        setData(json);
      } catch (error) {
        console.error("Chart fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCharts();
  }, []);

  return {
    data,
    loading,
  };
}
