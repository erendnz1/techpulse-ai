"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";


type Item = {
  label: string;
  value: number;
  icon?: LucideIcon;
  color: string;
  bgColor: string;
  iconColor: string;
};


type Props = {
  title: string;
  subtitle: string;
  badge?: string;
  items: Item[];
  footer?: ReactNode;
};



export default function DashboardProgressCard({
  title,
  subtitle,
  badge,
  items,
  footer,
}: Props) {


  const max = Math.max(
    ...items.map((i) => i.value),
    1
  );



  return (

    <div
      className="
        group
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
        hover:border-blue-500/40
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
              text-lg
              font-bold
              tracking-tight
              text-gray-900
              sm:text-xl
              dark:text-white
            "
          >
            {title}
          </h2>


          <p
            className="
              mt-1
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            {subtitle}
          </p>

        </div>



        {badge && (

          <span
            className="
              rounded-full
              bg-blue-500/10
              px-3
              py-1
              text-xs
              font-semibold
              tracking-wide
              text-blue-600
              transition-all
              duration-300
              group-hover:scale-105
              dark:text-blue-400
            "
          >
            {badge}
          </span>

        )}


      </div>





      {/* Items */}

      <div className="space-y-2 sm:space-y-3">


        {items.map((item)=>{

          const Icon=item.icon;


          return (

            <div
              key={item.label}
              className="
                rounded-xl
                border
                border-transparent
                p-2
                transition-all
                duration-300
                hover:border-blue-500/10
                hover:bg-blue-500/[0.03]
              "
            >


              <div
                className="
                  mb-2
                  flex
                  items-center
                  justify-between
                "
              >


                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >


                  {Icon && (

                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${item.bgColor}
                        transition-all
                        duration-300
                        group-hover/item:scale-110
                        sm:h-9
                        sm:w-9
                      `}
                    >

                      <Icon
                        className={`
                          h-4
                          w-4
                          ${item.iconColor}
                          sm:h-5
                          sm:w-5
                        `}
                      />

                    </div>

                  )}



                  <span
                    className="
                      truncate
                      text-sm
                      font-semibold
                      text-gray-800
                      dark:text-gray-100
                    "
                  >
                    {item.label}
                  </span>


                </div>




                <span
                  className="
                    shrink-0
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    px-2
                    py-1
                    text-xs
                    font-bold
                    text-gray-600
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-gray-300
                  "
                >
                  {item.value}
                </span>


              </div>





              <div
                className="
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-gray-200
                  dark:bg-white/10
                "
              >

                <div
                  className={`
                    ${item.color}
                    h-full
                    rounded-full
                    transition-all
                    duration-700
                  `}
                  style={{
                    width:`${(item.value / max) * 100}%`,
                  }}
                />

              </div>


            </div>

          );


        })}


      </div>





      {footer && (

        <div
          className="
            mt-5
            border-t
            border-gray-200
            pt-4
            dark:border-white/10
          "
        >

          {footer}

        </div>

      )}


    </div>

  );
}