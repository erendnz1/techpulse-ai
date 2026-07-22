"use client";

import {
  Users,
  Newspaper,
  Bell,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import AnimatedCounter from "./AnimatedCounter";

interface Stats {
  total_users: number;
  total_news: number;
  total_notifications: number;
  critical_alerts: number;
}

interface Props {
  stats: Stats;
}

export default function StatsCards({ stats }: Props) {

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      subtitle: "Registered accounts",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "News Articles",
      value: stats.total_news,
      subtitle: "Articles collected",
      icon: Newspaper,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "Notifications",
      value: stats.total_notifications,
      subtitle: "Alerts generated",
      icon: Bell,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Critical Alerts",
      value: stats.critical_alerts,
      subtitle: "Require attention",
      icon: ShieldAlert,
      gradient: "from-rose-500 to-red-600",
    },
  ];


  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >

      {cards.map((card) => {

        const Icon = card.icon;


        return (
          <div
            key={card.title}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-700
              bg-slate-800/60
              p-4
              sm:p-5
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-500/40
              hover:shadow-xl
              hover:shadow-indigo-500/10
            "
          >

            {/* Glow */}
            <div
              className="
                absolute
                -right-8
                -top-8
                h-20
                w-20
                rounded-full
                bg-indigo-500/10
                blur-3xl
                transition
                group-hover:bg-indigo-500/20
              "
            />


            <div className="relative">

              <div className="flex items-center justify-between">

                <div
                  className={`
                    rounded-xl
                    bg-gradient-to-br
                    ${card.gradient}
                    p-2.5
                    shadow-lg
                  `}
                >
                  <Icon
                    size={18}
                    className="text-white"
                  />
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-emerald-500/20
                    bg-emerald-500/10
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    text-emerald-400
                  "
                >
                  <TrendingUp size={10} />

                  Active
                </div>

              </div>


              <div className="mt-5">

                <p className="text-sm font-medium text-slate-400">
                  {card.title}
                </p>


                <h2 className="mt-1 text-3xl font-bold tracking-tight text-white">
                  <AnimatedCounter value={card.value} />
                </h2>


                <p className="mt-1 text-xs text-slate-500">
                  {card.subtitle}
                </p>

              </div>


            </div>

          </div>
        );
      })}

    </div>
  );
}