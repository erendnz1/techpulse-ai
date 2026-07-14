"use client";

import { useEffect, useState } from "react";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState("all");
    useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return;
  }

  fetch("http://localhost:8000/news", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log("News data:", data);

    if (Array.isArray(data)) {
      setNews(data);
    } else {
      setNews([]);
    }

    setLoading(false);
  });
}, []);
  return (
    <main className="min-h-screen bg-white p-10 text-slate-950 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">
        News
      </h1>

      <p className="mt-3 text-gray-500 dark:text-gray-400">
        Explore the latest technology news analyzed by AI.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
  {[
    { label: "All", value: "all" },
    { label: "Global", value: "global" },
    { label: "Türkiye", value: "turkey" },
  ].map((region) => (
    <button
      key={region.value}
      onClick={() => setSelectedRegion(region.value)}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        selectedRegion === region.value
          ? "bg-blue-600 text-white"
          : "border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {region.label}
    </button>
  ))}
</div>
     {!loading && (
  <p className="mt-2 text-sm text-gray-400">
    {news
      .filter((item) => !item.title?.toUpperCase().startsWith("CVE-"))
      .filter(
        (item) =>
          selectedRegion === "all" ||
          item.region?.toLowerCase() === selectedRegion
      ).length}{" "}
    articles found
  </p>
)}
{!loading &&
  news
    .filter((item) => !item.title?.toUpperCase().startsWith("CVE-"))
    .filter(
      (item) =>
        selectedRegion === "all" ||
        item.region?.toLowerCase() === selectedRegion
    ).length === 0 && (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white/70 p-8 text-center dark:border-gray-700 dark:bg-gray-800/60">
      <p className="font-medium text-gray-700 dark:text-gray-200">
        No articles found.
      </p>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        There are currently no technology articles available for this region.
      </p>
    </div>
  )}
{!loading && (
<div className="mt-8 grid gap-5">
{news
  .filter((item) => !item.title?.toUpperCase().startsWith("CVE-"))
  .filter(
    (item) =>
      selectedRegion === "all" ||
      item.region?.toLowerCase() === selectedRegion
  )
  .slice(0, 10)
  .map((item) => (
    <article
      key={item.id}
      className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
    >
      <div className="mb-4 flex flex-wrap gap-2">
  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
    {item.category || "Other"}
  </span>

  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
    {item.region === "turkey" ? "Türkiye" : "Global"}
  </span>
  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
  Importance {item.importance_score || 0}/10
</span>

<span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    item.risk_level === "Critical"
      ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
      : item.risk_level === "High"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
      : item.risk_level === "Medium"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
      : "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
  }`}
>
  {item.risk_level || "Low"} Risk
</span>
</div>


      <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
        {item.summary || "No summary available."}
      </p>
     <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">

  <div className="flex flex-col gap-1">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Source: {item.source || "Unknown"}
    </span>

    {item.published_at && (
      <span className="text-xs text-gray-400 dark:text-gray-500">
        Published: {new Date(item.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    )}
  </div>

  {item.url && (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
    >
      Read original →
    </a>
  )}

</div>
    </article>
  ))}
</div>
)}
    </main>
  );
}