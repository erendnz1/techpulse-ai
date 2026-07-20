"use client";

import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import SourceList from "@/components/dashboard/SourceList";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SourcesPage() {
  const [sources, setSources] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSources();
  }, []);

  async function fetchSources() {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setSources(data.sources ?? {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
          <Globe2 className="h-7 w-7 text-blue-500" />
        </div>

        <div>

          <h1 className="text-3xl font-bold">
            Technology Sources
          </h1>

          <p className="text-gray-500">
            {Object.keys(sources).length} Active Sources
          </p>

        </div>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <SourceList sources={sources} />
      )}

    </div>
  );
}