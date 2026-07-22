"use client";

import {
  Brain,
  Newspaper,
  ShieldAlert,
  Sparkles,
} from "lucide-react";


type Props = {
  stats?: {
    total_news: number;
    unread_notifications: number;
    categories: Record<string, number>;
    risk_levels: Record<string, number>;
  };
};



export default function AIActivity({
  stats,
}: Props) {


  const totalNews = stats?.total_news ?? 0;
  const critical = stats?.risk_levels?.Critical ?? 0;
  const security = stats?.categories?.Security ?? 0;



  return (

    <div
      className="
        h-full
        rounded-2xl
        border
        border-gray-200
        bg-white/70
        p-4
        sm:p-6
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-violet-500/30
        hover:shadow-xl
        dark:border-white/10
        dark:bg-white/5
      "
    >



      {/* Header */}

      <div
        className="
          mb-4
          flex
          items-start
          justify-between
          sm:mb-6
        "
      >

        <div>

          <h2
            className="
              flex
              items-center
              gap-2
              text-lg
              font-bold
              sm:text-xl
            "
          >

            <Brain
              className="
                h-5
                w-5
                text-violet-500
              "
            />

            AI Activity

          </h2>


          <p
            className="
              mt-1
              text-xs
              text-gray-500
              sm:text-sm
              dark:text-gray-400
            "
          >
            Real-time AI monitoring
          </p>


        </div>



        <span
          className="
            rounded-full
            bg-emerald-500/10
            px-3
            py-1
            text-xs
            font-semibold
            text-emerald-500
          "
        >
          ● Active
        </span>


      </div>





      <div
        className="
          space-y-3
          sm:space-y-4
        "
      >


        {/* Articles */}

        <ActivityItem
          icon={
            <Newspaper className="h-5 w-5 text-blue-500" />
          }
          title="Articles Analyzed"
          description="Processed by AI engine"
          value={totalNews}
          bg="bg-blue-500/10"
        />



        {/* Security */}

        <ActivityItem
          icon={
            <ShieldAlert className="h-5 w-5 text-red-500" />
          }
          title="Security Articles"
          description="Potential security threats"
          value={security}
          bg="bg-red-500/10"
        />



        {/* Critical */}

        <ActivityItem
          icon={
            <ShieldAlert className="h-5 w-5 text-orange-500" />
          }
          title="Critical Vulnerabilities"
          description="High priority issues"
          value={critical}
          bg="bg-orange-500/10"
        />




        {/* AI */}

        <div
          className="
            flex
            items-center
            justify-between
            rounded-xl
            border
            border-emerald-500/20
            bg-emerald-500/10
            p-3
            sm:p-4
          "
        >

          <div className="flex items-center gap-3">

            <Sparkles
              className="
                h-5
                w-5
                text-emerald-500
              "
            />


            <div>

              <p className="font-medium">
                AI Processing
              </p>


              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Latest analysis completed
              </p>


            </div>


          </div>



          <span
            className="
              rounded-full
              bg-emerald-500
              px-3
              py-1
              text-xs
              font-semibold
              text-white
            "
          >
            Completed
          </span>


        </div>


      </div>


    </div>

  );
}




function ActivityItem({
  icon,
  title,
  description,
  value,
  bg,
}: {
  icon: React.ReactNode;
  title:string;
  description:string;
  value:number;
  bg:string;
}) {


  return (

    <div
      className={`
        flex
        items-center
        justify-between
        rounded-xl
        ${bg}
        p-3
        sm:p-4
      `}
    >

      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
        "
      >

        {icon}


        <div>

          <p className="font-medium">
            {title}
          </p>


          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            {description}
          </p>


        </div>


      </div>



      <span
        className="
          ml-3
          text-xl
          font-bold
          sm:text-2xl
        "
      >
        {value}
      </span>


    </div>

  );

}