
"use client";
import { useEffect, useState } from "react";
export default function SecurityPage() {
  const [securityAlerts, setSecurityAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  useEffect(() => {
const token = localStorage.getItem("access_token");
fetch('${process.env.NEXT_PUBLIC_API_URL}/news', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
.then((res) => res.json())
.then((data) => {
  const securityItems = data.filter(
  (item: any) =>
    item.title?.toUpperCase().startsWith("CVE-") ||
    item.source === "KVKK"
);

setSecurityAlerts(securityItems);
  setLoading(false);
});
}, []);
const filteredSecurityAlerts = securityAlerts.filter((item) => {
  const matchesType =
    selectedType === "all" ||
    (selectedType === "cve" &&
      item.title?.toUpperCase().startsWith("CVE-")) ||
    (selectedType === "breach" && item.source === "KVKK");

  const matchesRegion =
    selectedRegion === "all" ||
    item.region?.toLowerCase() === selectedRegion;

  return matchesType && matchesRegion;
});
  return (
    <div className="px-6 py-10 md:px-10">
      <h1 className="text-3xl font-bold">
        Security Alerts
      </h1>

      <p className="mt-3 text-gray-500 dark:text-gray-400">
        Monitor the latest CVE vulnerabilities and AI-analyzed security risks.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
  {[
    { label: "All", value: "all" },
    { label: "CVE Vulnerabilities", value: "cve" },
    { label: "Data Breaches", value: "breach" },
  ].map((type) => (
    <button
      key={type.value}
      onClick={() => setSelectedType(type.value)}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        selectedType === type.value
          ? "bg-red-600 text-white"
          : "border border-gray-200 bg-white/70 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
    >
      {type.label}
    </button>
  ))}
</div>
<div className="mt-3 flex flex-wrap gap-3">
  {[
    { label: "All Regions", value: "all" },
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
      {loading && (
  <p className="mt-8 text-sm text-gray-400">
    Loading security alerts...
  </p>
)}
{!loading && (
  <p className="mt-6 text-sm text-gray-400">
    {filteredSecurityAlerts.length} security alerts found
  </p>
)}
{!loading && (
  <div className="mt-8 grid gap-5">
    {filteredSecurityAlerts.map((item) => (
      <article
        key={item.id}
        className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-red-500/50 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800/60"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    item.source === "KVKK"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
      : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
  }`}
>
  {item.source === "KVKK" ? "Data Breach" : "CVE Vulnerability"}
</span>
<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
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

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {item.title}
        </h2>

        <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
          {item.summary || "No summary available."}
        </p>
        {item.affected_technologies && (
  <div className="mt-5">
    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
      Affected Technologies
    </p>

    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {item.affected_technologies}
    </p>
  </div>
)}

{item.recommended_action && (
  <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50/70 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">
    <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
      Recommended Action
    </p>

    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-300">
      {item.recommended_action}
    </p>
  </div>
)}

<div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
  <div className="flex flex-col gap-1">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Source: {item.source || "Unknown"}
    </span>

    {item.published_at && (
      <span className="text-xs text-gray-400 dark:text-gray-500">
        Published:{" "}
        {new Date(item.published_at).toLocaleDateString("en-US", {
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
      className="text-sm font-medium text-red-600 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
    >
      View vulnerability →
    </a>
  )}
</div>
      </article>
    ))}
  </div>
)}
    </div>
  );
}