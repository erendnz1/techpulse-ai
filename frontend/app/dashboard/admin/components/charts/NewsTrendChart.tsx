"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useAdminCharts } from "@/hooks/useAdminCharts";

export default function NewsTrendChart() {
  const { data, loading } = useAdminCharts();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5">
        <h2 className="mb-3 text-base font-semibold text-white">
          Last 7 Days News
        </h2>

        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-base font-semibold text-white">
          Last 7 Days News
        </h2>

        <span className="text-xs text-slate-400">
          Daily Trend
        </span>

      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data?.daily_news}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="#1e293b"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{
              r: 4,
            }}
            activeDot={{
              r: 6,
            }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}