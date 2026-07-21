"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useAdminCharts } from "@/hooks/useAdminCharts";

const COLORS = {
  Low: "#22c55e",
  Medium: "#3b82f6",
  High: "#f59e0b",
  Critical: "#ef4444",
};

export default function RiskChart() {
  const { data, loading } = useAdminCharts();

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">
        <h2 className="mb-3 text-base font-semibold text-white">
          Risk Levels
        </h2>

        <p className="text-sm text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  const total =
    data?.risk_levels.reduce((sum, item) => sum + item.value, 0) ?? 0;

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          Risk Levels
        </h2>

        <span className="text-xs text-slate-400">
          {data?.risk_levels.length} Levels
        </span>
      </div>

      <div className="grid h-[250px] grid-cols-[140px_1fr] items-center gap-5">

        <div className="relative h-full">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.risk_levels}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={4}
                stroke="none"
              >
                {data?.risk_levels.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        entry.name as keyof typeof COLORS
                      ] || "#64748b"
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">
              {total}
            </span>

            <span className="text-[11px] text-slate-400">
              Total
            </span>
          </div>

        </div>

        <div className="space-y-3">

          {data?.risk_levels.map((risk) => {

            const percent =
              total === 0
                ? 0
                : ((risk.value / total) * 100).toFixed(1);

            return (
              <div
                key={risk.name}
                className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">

                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        COLORS[
                          risk.name as keyof typeof COLORS
                        ] || "#64748b",
                    }}
                  />

                  <span className="text-sm text-slate-300">
                    {risk.name}
                  </span>

                </div>

                <div className="text-right">

                  <p className="text-sm font-semibold text-white">
                    {risk.value}
                  </p>

                  <p className="text-xs text-slate-500">
                    {percent}%
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}