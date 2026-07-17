"use client";

import {
  ShieldX,
  ShieldAlert,
  Shield,
  ShieldCheck,
  CircleOff,
} from "lucide-react";

type Props = {
  risks?: Record<string, number>;
};

const iconMap: Record<string, any> = {
  Critical: ShieldX,
  High: ShieldAlert,
  Medium: Shield,
  Low: ShieldCheck,
  None: CircleOff,
};

const colorMap: Record<string, string> = {
  Critical: "bg-purple-500",
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
  None: "bg-slate-500",
};

const iconColorMap: Record<string, string> = {
  Critical: "text-purple-500",
  High: "text-red-500",
  Medium: "text-yellow-500",
  Low: "text-green-500",
  None: "text-slate-500",
};

export default function RiskChart({ risks }: Props) {
  const data = Object.entries(risks ?? {}).sort(
    (a, b) => b[1] - a[1]
  );

  const max = data.length ? data[0][1] : 1;

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">
          Risk Levels
        </h2>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Current security status
        </p>
      </div>

      <div className="space-y-5">

        {data.map(([risk, value]) => {
          const Icon = iconMap[risk];

          return (
            <div key={risk}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  {Icon && (
                    <Icon
                      className={`h-5 w-5 ${
                        iconColorMap[risk] ?? "text-blue-500"
                      }`}
                    />
                  )}

                  <span className="text-sm font-medium">
                    {risk}
                  </span>

                </div>

                <span className="text-sm font-semibold text-gray-500">
                  {value}
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">

                <div
                  className={`h-full rounded-full ${
                    colorMap[risk] ?? "bg-blue-500"
                  }`}
                  style={{
                    width: `${(value / max) * 100}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}