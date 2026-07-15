"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Brain,
  Check,
  Globe2,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
} from "lucide-react";

const categories = [
  "AI",
  "Security",
  "Cloud",
  "DevOps",
  "Developer Tools",
  "Software",
  "Mobile",
  "Business",
];

const regions = [
  {
    value: "global",
    label: "Global",
    description: "Worldwide technology news and developments.",
    icon: Globe2,
  },
  {
    value: "turkey",
    label: "Türkiye",
    description: "Technology news and security alerts from Türkiye.",
    icon: MapPin,
  },
];

type Preferences = {
  categories: string[];
  regions: string[];
  minimum_importance_score: number;
  notification_enabled: boolean;
};

const defaultPreferences: Preferences = {
  categories: [],
  regions: [],
  minimum_importance_score: 5,
  notification_enabled: true,
};

export default function PreferencesPage() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [preferencesExist, setPreferencesExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Authentication token not found.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          '${process.env.NEXT_PUBLIC_API_URL}/preferences/me',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          setPreferencesExist(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load preferences.");
        }

        const data: Preferences = await response.json();

        setPreferences(data);
        setPreferencesExist(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load preferences."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const toggleCategory = (category: string) => {
    setMessage("");
    setError("");

    setPreferences((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((item) => item !== category)
        : [...current.categories, category],
    }));
  };

  const toggleRegion = (region: string) => {
    setMessage("");
    setError("");

    setPreferences((current) => ({
      ...current,
      regions: current.regions.includes(region)
        ? current.regions.filter((item) => item !== region)
        : [...current.regions, region],
    }));
  };

  const savePreferences = async () => {
    setMessage("");
    setError("");

    if (preferences.categories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    if (preferences.regions.length === 0) {
      setError("Please select at least one region.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        '${process.env.NEXT_PUBLIC_API_URL}/preferences/me',
        {
          method: preferencesExist ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.detail || "Failed to save preferences."
        );
      }

      const data: Preferences = await response.json();

      setPreferences(data);
      setPreferencesExist(true);
      setMessage("Preferences saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save preferences."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading preferences...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
          Preferences
        </h1>

        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Customize your technology interests and notification preferences.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {/* Categories */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
              <Brain className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Technology Interests
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select the categories you want to follow.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => {
              const selected =
                preferences.categories.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400 hover:text-blue-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300"
                  }`}
                >
                  {selected && <Check className="h-4 w-4" />}
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* Regions */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
              <Globe2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Regions
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Choose which regions you want to receive news from.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {regions.map((region) => {
              const selected = preferences.regions.includes(
                region.value
              );

              const Icon = region.icon;

              return (
                <button
                  key={region.value}
                  type="button"
                  onClick={() => toggleRegion(region.value)}
                  className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`rounded-xl p-3 ${
                      selected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-950 dark:text-white">
                        {region.label}
                      </h3>

                      {selected && (
                        <Check className="h-4 w-4 text-blue-500" />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {region.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Importance score */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                Minimum Importance Score
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Only receive notifications for news with this importance
                score or higher.
              </p>
            </div>

            <div className="rounded-xl bg-orange-500/10 px-4 py-2 font-bold text-orange-500">
              {preferences.minimum_importance_score}/10
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={preferences.minimum_importance_score}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                minimum_importance_score: Number(
                  event.target.value
                ),
              }))
            }
            className="mt-7 w-full cursor-pointer accent-blue-500"
          />

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>1 — All news</span>
            <span>10 — Critical only</span>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-500">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications when relevant technology news
                  matches your preferences.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={preferences.notification_enabled}
              onClick={() =>
                setPreferences((current) => ({
                  ...current,
                  notification_enabled:
                    !current.notification_enabled,
                }))
              }
              className={`relative h-7 w-12 flex-shrink-0 rounded-full transition ${
                preferences.notification_enabled
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  preferences.notification_enabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
            {message}
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={savePreferences}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}