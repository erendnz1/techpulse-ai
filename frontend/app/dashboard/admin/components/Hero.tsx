"use client";

import Image from "next/image";
import {
  CalendarDays,
  Crown,
  ShieldCheck,
} from "lucide-react";

export default function Hero() {
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl">

      <div className="absolute -top-16 right-0 h-44 w-44 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="relative flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div className="max-w-2xl">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-indigo-300">
            <Crown size={14} />

            <span className="text-xs font-semibold">
              Administrator Panel
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white">
            Welcome back,
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Administrator
            </span>
          </h1>

          <p className="mt-2 max-w-lg text-sm text-slate-400">
            Monitor platform health, manage users and control TechPulse AI from one place.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2">
              <ShieldCheck
                size={15}
                className="text-emerald-400"
              />

              <span className="text-sm text-white">
                System Healthy
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2">
              <CalendarDays
                size={15}
                className="text-indigo-400"
              />

              <span className="text-sm text-white">
                {today}
              </span>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-4 backdrop-blur">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-slate-800 p-2.5">
              <Image
                src="/logo.png"
                alt="TechPulse AI"
                width={34}
                height={34}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                TechPulse AI
              </h3>

              <p className="text-xs text-slate-400">
                Administration Center
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}