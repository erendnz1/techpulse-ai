"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Brain,
  Check,
  ChevronRight,
  Globe2,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const categories = [
  "AI",
  "Security",
  "Cloud",
  "DevOps",
  "Developer Tools",
  "Software",
  "Frameworks",
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

export default function OnboardingPage() {
  const router = useRouter();

  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Protect onboarding:
   * - No token -> login
   * - Preferences already exist -> dashboard
   * - 404 -> new user, show onboarding
   */
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/preferences/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (response.ok) {
  router.replace("/dashboard");
  return;
}

        if (response.status === 404) {
          setLoading(false);
          return;
        }

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.replace("/login");
          return;
        }

        throw new Error(
          "Unable to check your onboarding status."
        );
      } catch (error) {
        console.error("Onboarding status error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load onboarding."
        );

        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [router]);

  const toggleCategory = (category: string) => {
    setError("");

    setPreferences((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter(
            (item) => item !== category
          )
        : [...current.categories, category],
    }));
  };

  const toggleRegion = (region: string) => {
    setError("");

    setPreferences((current) => ({
      ...current,
      regions: current.regions.includes(region)
        ? current.regions.filter(
            (item) => item !== region
          )
        : [...current.regions, region],
    }));
  };

  const completeOnboarding = async () => {
    setError("");

    if (preferences.categories.length === 0) {
      setError("Please select at least one technology interest.");
      return;
    }

    if (preferences.regions.length === 0) {
      setError("Please select at least one region.");
      return;
    }

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/preferences/me`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preferences),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Failed to save preferences."
        );
      }

      router.replace("/dashboard");
    } catch (error) {
      console.error("Complete onboarding error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-gray-950">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing your experience...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-4 py-12 text-gray-950 dark:bg-gray-950 dark:text-white md:px-8">
      {/* Background */}
      {/* Background glow effects */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">
  {/* Top center main glow */}
  <div className="absolute left-1/2 top-[-180px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[140px] dark:bg-blue-500/25" />

  {/* Left ambient glow */}
  <div className="absolute left-[-180px] top-[30%] h-[420px] w-[420px] rounded-full bg-blue-400/10 blur-[130px] dark:bg-blue-500/15" />

  {/* Right ambient glow */}
  <div className="absolute right-[-180px] top-[55%] h-[420px] w-[420px] rounded-full bg-indigo-400/10 blur-[130px] dark:bg-indigo-500/15" />

  {/* Subtle center radial light */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_45%)]" />
</div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-7 w-7" />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Welcome to TechPulse AI
          </p>

          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Personalize your technology intelligence feed
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500 dark:text-gray-400">
            Choose the technologies, regions and importance level
            you care about. TechPulse AI will use these preferences
            to personalize your news feed and notifications.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {/* Technology interests */}
          <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
                <Brain className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  What technologies interest you?
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select one or more categories to personalize your
                  feed.
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
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300 dark:hover:text-blue-400"
                    }`}
                  >
                    {selected && (
                      <Check className="h-4 w-4" />
                    )}

                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Regions */}
          <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-500">
                <Globe2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  Which regions do you want to follow?
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You can select both Global and Türkiye.
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
                        : "border-gray-200 bg-gray-50/50 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`rounded-xl p-3 ${
                        selected
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
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

          {/* Importance */}
          <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-orange-500/10 p-2.5 text-orange-500">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  Minimum importance score
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Only receive notifications for news at or above
                  this importance level.
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
              className="mt-7 w-full cursor-pointer accent-blue-600"
            />

            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>1 — All news</span>
              <span>10 — Critical only</span>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] md:p-8">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-500">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Enable notifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts when important technology news
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
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  preferences.notification_enabled
                    ? "bg-blue-600"
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

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Complete */}
          <div className="flex flex-col items-center pt-3">
            <button
              type="button"
              onClick={completeOnboarding}
              disabled={saving}
              className="flex min-w-64 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving preferences...
                </>
              ) : (
                <>
                  Complete setup
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              You can change these preferences anytime from your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}