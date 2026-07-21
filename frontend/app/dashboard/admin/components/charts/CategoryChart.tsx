"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useAdminCharts } from "@/hooks/useAdminCharts";

export default function CategoryChart() {
  const { data, loading } = useAdminCharts();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">
        <h2 className="mb-3 text-base font-semibold text-white">
          News Categories
        </h2>

        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          News Categories
        </h2>

        <span className="text-xs text-slate-400">
          {data?.categories.length} Categories
        </span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data?.categories}
          layout="vertical"
          barCategoryGap={8}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid
            stroke="#1e293b"
            horizontal={true}
            vertical={false}
          />

          <XAxis
            type="number"
            stroke="#64748b"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="name"
            width={105}
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "12px",
            }}
            labelStyle={{ color: "#fff" }}
          />

          <Bar
            dataKey="value"
            fill="#3B82F6"
            radius={[0, 6, 6, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}