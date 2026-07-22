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
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 sm:p-5 backdrop-blur-xl">

        <h2 className="mb-3 text-base font-semibold text-white">
          Last 7 Days News
        </h2>


        <p className="text-sm text-slate-400">
          Loading...
        </p>

      </div>
    );
  }


  const chartData = data?.daily_news ?? [];


  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700
        bg-slate-800/60
        p-4
        sm:p-5
        backdrop-blur-xl
      "
    >


      <div
        className="
          mb-4
          flex
          flex-col
          gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <h2 className="text-base font-semibold text-white">
          Last 7 Days News
        </h2>


        <span className="text-xs text-slate-400">
          Daily Trend
        </span>


      </div>



      <div className="h-[220px] w-full sm:h-[260px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={chartData}
            margin={{
              top:5,
              right:10,
              left:0,
              bottom:5,
            }}
          >

            <CartesianGrid
              stroke="#1e293b"
              vertical={false}
            />


            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{
                fontSize:11,
              }}
              interval="preserveStartEnd"
            />


            <YAxis
              stroke="#64748b"
              tick={{
                fontSize:11,
              }}
              allowDecimals={false}
            />


            <Tooltip
              contentStyle={{
                background:"#0f172a",
                border:"1px solid #334155",
                borderRadius:"12px",
              }}
            />


            <Line
              type="monotone"
              dataKey="count"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{
                r:3,
              }}
              activeDot={{
                r:6,
              }}
            />


          </LineChart>


        </ResponsiveContainer>


      </div>


    </div>
  );
}