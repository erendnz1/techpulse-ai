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
    <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/60 backdrop-blur-xl">

      <div className="absolute -top-20 right-0 h-60 w-60 rounded-full bg-indigo-600/15 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">

        {/* LEFT */}

        <div className="max-w-2xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-indigo-300">

            <Crown size={15} />

            <span className="text-xs font-semibold">
              Administrator Panel
            </span>

          </div>

          <h1 className="text-3xl font-bold text-white">

            Welcome back,

            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Administrator
            </span>

          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
            Manage users, monitor platform health and control TechPulse AI from one dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2">

              <ShieldCheck
                size={16}
                className="text-emerald-400"
              />

              <span className="text-sm text-white">
                Healthy
              </span>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-2">

              <CalendarDays
                size={16}
                className="text-indigo-400"
              />

              <span className="text-sm text-white">
                {today}
              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5 backdrop-blur">

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-slate-800 p-3">

              <Image
                src="/logo.png"
                alt="TechPulse AI"
                width={42}
                height={42}
              />

            </div>

            <div>

              <h3 className="font-semibold text-white">
                TechPulse AI
              </h3>

              <p className="text-sm text-slate-400">
                Administration Center
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}