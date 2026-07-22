"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Bell,
  SlidersHorizontal,
  Globe,
  Tag,
  Eye,
  EyeOff,
} from "lucide-react";
import { ChevronRight } from "lucide-react";
interface UserData {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface PreferencesData {
  id: number;
  user_id: number;
  categories: string[];
  regions: string[];
  minimum_importance_score: number;
  notification_enabled: boolean;
  email_notification_enabled: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [preferences, setPreferences] =
    useState<PreferencesData | null>(null);
 const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [changing, setChanging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordMessage, setPasswordMessage] = useState("");
const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Authentication required.");
          return;
        }

        const [userRes, prefRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (!userRes.ok) {
          throw new Error("Unable to load profile.");
        }

        const userData = await userRes.json();
        setUser(userData);

        if (prefRes.ok) {
          const prefData = await prefRes.json();
          setPreferences(prefData);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load profile information.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);
 const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
  setPasswordError("New passwords do not match.");
  setTimeout(() => {
  setPasswordError("");
}, 3000);
  setPasswordMessage("");
  return;
}

  try {
    setChanging(true);

    const token = localStorage.getItem("access_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      }
    );

    

   const data = await response.json();

if (!response.ok) {
  if (response.status === 422) {
    setPasswordError("Password must be at least 8 characters long.");
    setTimeout(() => {
  setPasswordError("");
}, 3000);
    setPasswordMessage("");
    return;
  }

  setPasswordError(data.detail || "Unable to change password.");
  setTimeout(() => {
  setPasswordError("");
}, 3000);
  setPasswordMessage("");
  return;
}

// ✅ Başarılı durum
setPasswordError("");
setPasswordMessage("Password changed successfully.");
setTimeout(() => {
  setPasswordMessage("");
}, 3000);

setCurrentPassword("");
setNewPassword("");
setConfirmPassword("");
  } catch (err) {
    console.error(err);
    setPasswordError("Failed to change password.");
setPasswordMessage("");
  } finally {
    setChanging(false);
  }
};
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/30">
          <p className="font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Manage your TechPulse AI account,
preferences and notification settings.
        </p>

       <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-md sm:p-8 dark:border-gray-700 dark:bg-gray-800">

          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row">

           <div className="relative">
  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white shadow-lg">
    {user.username.slice(0,2).toUpperCase()}
  </div>

  <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500 dark:border-gray-800" />
</div>
              {user.username.slice(0, 2).toUpperCase()}
            </div>

            <div>
  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
    {user.username}
  </h2>

  <p className="text-gray-500 dark:text-gray-400">
    {user.email}
  </p>

  <span className="mt-3 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
    TechPulse Member
  </span>
</div>

          </div>

          <div className="mt-8 grid gap-4 sm:gap-6 lg:grid-cols-2">

            <InfoCard
              icon={<User size={18} />}
              title="Username"
              value={user.username}
            />

            <InfoCard
              icon={<Mail size={18} />}
              title="Email"
              value={user.email}
            />

            <StatusCard active={user.is_active} />

            <NotificationCard
              enabled={
                preferences?.email_notification_enabled ?? false
              }
            />

            <InfoCard
              icon={<SlidersHorizontal size={18} />}
              title="Minimum Importance"
              value={`${preferences?.minimum_importance_score ?? "-"} / 10`}
            />
            <InfoCard
              icon={<User size={18} />}
              title="Member Since"
              value={formatDate(user.created_at)}
            />

            <TagsCard
              icon={<Globe size={18} />}
              title="Preferred Regions"
              values={
                [...(preferences?.regions ?? [])]
                  .sort((a, b) => {
                    if (a === "global") return -1;
                    if (b === "global") return 1;
                    return 0;
                  })
                  .map((region) =>
                    region === "global" ? "Global" : "Türkiye"
                  )
              }
            />

            <div className="lg:col-span-2">
              <TagsCard
                icon={<Tag size={18} />}
                title="Interested Categories"
                values={[...(preferences?.categories ?? [])].sort()}
              />
            </div>

          </div>

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

            <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
              Account Overview
            </h3>

            <div className="space-y-4">

              <OverviewRow
                label="User ID"
                value={String(user.id)}
              />

              <OverviewRow
                label="Authentication"
                value="JWT Protected"
              />

              <OverviewRow
                label="Preferences"
                value={
                  preferences ? "Configured" : "Not Configured"
                }
              />

              <OverviewRow
                label="Account"
                value={user.is_active ? "Active" : "Inactive"}
              />

            </div>

          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">

            

  <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
    Security
  </h3>
{passwordMessage && (
  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
    ✅ {passwordMessage}
  </div>
)}

{passwordError && (
  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
    ❌ {passwordError}
  </div>
)}
  <div className="space-y-4">

    <div>
      <label className="mb-2 block text-sm font-medium">
        Current Password
      </label>

      <div className="relative">
  <input
    type={showCurrentPassword ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => {
      setCurrentPassword(e.target.value);
      setPasswordError("");
    }}
    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 dark:border-gray-700 dark:bg-gray-900"
  />

  <button
    type="button"
    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
  >
    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
    </div>

    <div>
  <label className="mb-2 block text-sm font-medium">
    New Password
  </label>

  <div className="relative">
    <input
      type={showNewPassword ? "text" : "password"}
      value={newPassword}
      onChange={(e) => {
        setNewPassword(e.target.value);
        setPasswordError("");
      }}
      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 dark:border-gray-700 dark:bg-gray-900"
    />

    <button
      type="button"
      onClick={() => setShowNewPassword(!showNewPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
    >
      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

    <div>
  <label className="mb-2 block text-sm font-medium">
    Confirm Password
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => {
        setConfirmPassword(e.target.value);
        setPasswordError("");
      }}
      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 dark:border-gray-700 dark:bg-gray-900"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
    >
      {showConfirmPassword ? (
        <EyeOff size={20} />
      ) : (
        <Eye size={20} />
      )}
    </button>
  </div>
</div>
<button
  onClick={handleChangePassword}
  disabled={changing}
  className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {changing ? (
    <>
      <svg
        className="mr-2 h-5 w-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      Changing...
    </>
  ) : (
    "Change Password"
  )}
</button>
  </div>

</div>

          </div>

        </div>
   
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        {icon}
        {title}
      </label>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium dark:border-gray-700 dark:bg-gray-900">
        {value}
      </div>
    </div>
  );
}

function TagsCard({
  icon,
  title,
  values,
}: {
  icon: React.ReactNode;
  title: string;
  values: string[];
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        {icon}
        {title}
      </label>

      <div className="flex min-h-[58px] flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        {values.map((item) => (
          <span
            key={item}
            className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusCard({ active }: { active: boolean }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        <ShieldCheck size={18} />
        Account Status
      </label>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
            active
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          }`}
        >
          <span
            className={`mr-2 h-2 w-2 rounded-full ${
              active ? "bg-green-500" : "bg-red-500"
            }`}
          />

          {active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}

function NotificationCard({
  enabled,
}: {
  enabled: boolean;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        <Bell size={18} />
        Email Notifications
      </label>

      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            enabled
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
}

function OverviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gray-200 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
      <span className="text-gray-500">{label}</span>

      <span className="font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}