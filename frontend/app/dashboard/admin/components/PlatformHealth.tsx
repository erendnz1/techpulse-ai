"use client";

import {
  Database,
  Server,
  Brain,
  Clock3,
  CheckCircle2,
  XCircle,
  Radio,
} from "lucide-react";

import { usePlatformHealth } from "@/hooks/usePlatformHealth";

function StatusRow({
  icon: Icon,
  title,
  online,
  onlineText,
  offlineText,
}: {
  icon: React.ElementType;
  title: string;
  online: boolean;
  onlineText: string;
  offlineText: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3 transition hover:border-indigo-500 hover:bg-slate-900/70">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-800 p-2">
          <Icon
            size={16}
            className="text-indigo-400"
          />
        </div>

        <span className="text-sm text-slate-300">
          {title}
        </span>

      </div>

      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
          online
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {online ? (
          <CheckCircle2 size={14} />
        ) : (
          <XCircle size={14} />
        )}

        {online ? onlineText : offlineText}
      </div>

    </div>
  );
}

export default function PlatformHealth() {
  const { data, loading } = usePlatformHealth();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">
        <h2 className="mb-3 text-lg font-bold text-white">
          Platform Health
        </h2>

        <p className="text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-red-500 bg-slate-800/60 p-5 backdrop-blur-xl">
        <p className="text-red-400">
          Failed to load platform status.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-bold text-white">
          Platform Health
        </h2>

        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          <Radio size={13} />
          Live
        </div>

      </div>

      <div className="space-y-3">

        <StatusRow
          icon={Server}
          title="API Server"
          online={data.backend}
          onlineText="Online"
          offlineText="Offline"
        />

        <StatusRow
          icon={Database}
          title="Database"
          online={data.database}
          onlineText="Connected"
          offlineText="Disconnected"
        />

        <StatusRow
          icon={Clock3}
          title="Scheduler"
          online={data.scheduler}
          onlineText="Running"
          offlineText="Stopped"
        />

        <StatusRow
          icon={Brain}
          title="AI Service"
          online={data.ai}
          onlineText="Active"
          offlineText="Unavailable"
        />

      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3">

        <span className="text-sm text-slate-400">
          Active News Sources
        </span>

        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
          {data.news_sources}
        </span>

      </div>

    </div>
  );
}