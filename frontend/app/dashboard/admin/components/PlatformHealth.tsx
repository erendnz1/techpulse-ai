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
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 p-4 transition-all duration-300 hover:border-indigo-500 hover:bg-slate-900/70">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-slate-800 p-2">
          <Icon
            size={18}
            className="text-indigo-400"
          />
        </div>

        <span className="text-slate-300">
          {title}
        </span>

      </div>

      <div
        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
          online
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-red-500/10 text-red-400"
        }`}
      >
        {online ? (
          <CheckCircle2 size={15} />
        ) : (
          <XCircle size={15} />
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
      <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-xl">
        <h2 className="mb-4 text-xl font-bold text-white">
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
      <div className="rounded-3xl border border-red-500 bg-slate-800/60 p-6 backdrop-blur-xl">
        <p className="text-red-400">
          Failed to load platform status.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-800/60 p-6 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-bold text-white">
          Platform Health
        </h2>

        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
          <Radio size={15} />
          Live
        </div>

      </div>

      <div className="space-y-4">

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

      <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/40 p-4">

        <div className="flex items-center justify-between">

          <span className="text-slate-400">
            Active News Sources
          </span>

          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-400">
            {data.news_sources}
          </span>

        </div>

      </div>

    </div>
  );
}