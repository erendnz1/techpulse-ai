"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";


type Alert = {
  id: number;
  title: string;
  summary?: string;
  risk_level?: string;
  published_at?: string;
};



const badgeStyles = (risk?: string) => {

  switch (risk) {

    case "Critical":
      return "bg-red-500 text-white";

    case "High":
      return "bg-orange-500 text-white";

    case "Medium":
      return "bg-yellow-500 text-white";

    case "Low":
      return "bg-emerald-500 text-white";

    default:
      return "bg-blue-500 text-white";

  }

};



export default function RecentSecurityAlerts() {


  const [alerts,setAlerts] = useState<Alert[]>([]);



  useEffect(()=>{

    const fetchAlerts = async()=>{

      try{

        const token =
          localStorage.getItem("access_token");


        if(!token) return;



        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/news/security?skip=0&limit=3`,
          {
            headers:{
              Authorization:`Bearer ${token}`,
            },
          }
        );



        if(!response.ok){
          throw new Error(
            "Failed to load security alerts."
          );
        }



        setAlerts(
          await response.json()
        );

      }
      catch(error){

        console.error(error);

      }

    };


    fetchAlerts();

  },[]);





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
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-red-500/20
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

            <ShieldAlert
              className="
                h-5
                w-5
                text-red-500
              "
            />

            Recent Security Alerts

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
            Latest AI-detected vulnerabilities
          </p>



        </div>




        <Link
          href="/dashboard/security"
          className="
            flex
            items-center
            gap-1
            text-sm
            font-medium
            text-blue-500
            hover:text-blue-600
          "
        >

          View All

          <ChevronRight
            className="
              h-4
              w-4
            "
          />

        </Link>


      </div>





      <div
        className="
          flex
          flex-col
          gap-3
        "
      >



        {alerts.map((item)=>(


          <div
            key={item.id}

            className="
              rounded-xl
              border
              border-gray-200
              bg-white/50
              p-3
              sm:p-4
              transition-all
              duration-300
              hover:border-red-300
              hover:bg-red-50/30
              hover:shadow-md
              dark:border-white/10
              dark:bg-white/[0.03]
            "
          >



            <div
              className="
                mb-2
                flex
                flex-wrap
                items-center
                justify-between
                gap-2
              "
            >



              <span
                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${badgeStyles(item.risk_level)}
                `}
              >

                {item.risk_level ?? "Unknown"}

              </span>




              <span
                className="
                  rounded-md
                  bg-gray-100
                  px-2
                  py-1
                  text-xs
                  text-gray-500
                  dark:bg-white/10
                "
              >

                {item.published_at?.split("T")[0]}

              </span>


            </div>





            <div
              className="
                flex
                items-start
                gap-3
              "
            >


              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-500/10
                "
              >

                <TriangleAlert
                  className="
                    h-4
                    w-4
                    text-red-500
                  "
                />

              </div>




              <div
                className="
                  min-w-0
                  flex-1
                "
              >


                <p
                  className="
                    line-clamp-2
                    text-sm
                    font-semibold
                  "
                >
                  {item.title}
                </p>




                {item.summary && (

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      text-xs
                      leading-5
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {item.summary}
                  </p>

                )}



              </div>


            </div>


          </div>


        ))}




        {alerts.length === 0 && (

          <div
            className="
              rounded-xl
              border
              border-dashed
              border-gray-300
              py-8
              text-center
              dark:border-white/10
            "
          >

            <ShieldAlert
              className="
                mx-auto
                mb-3
                h-8
                w-8
                text-gray-400
              "
            />


            <p className="font-medium">
              No security alerts found
            </p>


            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Everything looks secure for now.
            </p>


          </div>

        )}



      </div>


    </div>

  );

}