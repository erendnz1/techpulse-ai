"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  UserPlus,
  Newspaper,
  Bell,
  ShieldAlert,
} from "lucide-react";

interface ActivityItem {
  type: string;
  title: string;
  created_at: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!response.ok) {
          throw new Error(
            "Failed to fetch activities."
          );
        }


        const data = await response.json();

        setActivities(data);


      } catch (err) {

        console.error(err);

        setError(
          "Failed to load recent activity."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchActivities();

  }, []);



  const getIcon = (type: string) => {

    switch (type) {

      case "news":
        return {
          icon: Newspaper,
          color: "text-emerald-400",
        };


      case "notification":
        return {
          icon: Bell,
          color: "text-amber-400",
        };


      case "user":
        return {
          icon: UserPlus,
          color: "text-blue-400",
        };


      default:
        return {
          icon: ShieldAlert,
          color: "text-red-400",
        };

    }
  };



  const getBadge = (type: string) => {

    switch (type) {

      case "news":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";


      case "notification":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";


      case "user":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";


      default:
        return "bg-red-500/15 text-red-400 border-red-500/30";

    }
  };



  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-5 backdrop-blur-xl">
        <p className="text-slate-400">
          Loading...
        </p>
      </div>
    );
  }



  if (error) {
    return (
      <div className="rounded-2xl border border-red-500 bg-slate-800/60 p-5 backdrop-blur-xl">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }



  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-center backdrop-blur-xl">

        <Activity
          size={42}
          className="mx-auto mb-4 text-slate-500"
        />

        <h3 className="text-lg font-semibold text-white">
          No activity yet
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Recent platform events will appear here.
        </p>

      </div>
    );
  }



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
          mb-5
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-indigo-500/15 p-2">
            <Activity
              size={18}
              className="text-indigo-400"
            />
          </div>


          <div>

            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>


            <p className="text-sm text-slate-400">
              Latest platform events
            </p>

          </div>

        </div>


        <span
          className="
            w-fit
            rounded-full
            border
            border-slate-700
            px-3
            py-1
            text-xs
            text-slate-400
          "
        >
          {activities.length} Events
        </span>

      </div>



      <div className="relative max-h-[380px] overflow-y-auto pr-1 sm:pr-2">

        <div className="absolute bottom-0 left-[18px] top-0 w-px bg-slate-700" />


        <div className="space-y-4">

          {activities.map((item,index)=>{

            const {
              icon:Icon,
              color
            } = getIcon(item.type);


            return (

              <div
                key={`${item.type}-${index}`}
                className="relative flex gap-3"
              >

                <div
                  className="
                    relative
                    z-10
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-slate-700
                    bg-slate-900
                  "
                >

                  <Icon
                    size={16}
                    className={color}
                  />

                </div>



                <div
                  className="
                    min-w-0
                    flex-1
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-900/40
                    p-3
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-indigo-500
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >

                    <div className="min-w-0">

                      <h3
                        className="
                          line-clamp-2
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {item.title}
                      </h3>


                      <span
                        className={`
                          mt-2
                          inline-flex
                          rounded-full
                          border
                          px-2
                          py-0.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          ${getBadge(item.type)}
                        `}
                      >
                        {item.type}
                      </span>


                    </div>


                    <span
                      className="
                        shrink-0
                        text-xs
                        text-slate-500
                      "
                    >
                      {formatDistanceToNow(
                        new Date(item.created_at),
                        {
                          addSuffix:true,
                        }
                      )}
                    </span>


                  </div>

                </div>


              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}