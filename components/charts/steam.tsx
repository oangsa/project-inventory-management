"use client"

import getProducts from "@/libs/getProducts";
import getDataByCookie from "@/libs/getUserByCookie";
import { roles, User } from "@/interfaces/controller-types";
import { useEffect, useState } from "react";
import Chart, { Props } from "react-apexcharts";
import getCookieValue from "@/libs/getCookieValue";

export function Steam() {
   const [dataInState, setDataInState] = useState<number[]>([]);
   const [catagories, setCatagories] = useState<string[]>([]);

   const state: Props["series"] = [
      {
         name: "Sold",
         data: dataInState,
      },
      ];

      const options: Props["options"] = {
      chart: {
         type: "bar",
         animations: {
            dynamicAnimation: {
               enabled: true,
               speed: 300,
            },
            speed: 300,
         },
         sparkline: {
            enabled: false,
         },
         brush: {
            enabled: false,
         },
         id: "basic-bar",
         foreColor: "hsl(var(--nextui-default-800))",
         stacked: true,
         toolbar: {
            show: false,
         },
      },

      xaxis: {
         categories: catagories,
         labels: {
            // show: false,
            style: {
            colors: "hsl(var(--nextui-default-800))",
            },
         },
         axisBorder: {
            color: "hsl(var(--nextui-nextui-default-200))",
         },
         axisTicks: {
            color: "hsl(var(--nextui-nextui-default-200))",
         },
      },
      yaxis: {
         labels: {
            style: {
            // hsl(var(--nextui-content1-foreground))
            colors: "hsl(var(--nextui-default-800))",
            },
         },
      },
      tooltip: {
         enabled: false,
      },
      grid: {
         show: true,
         borderColor: "hsl(var(--nextui-default-200))",
         strokeDashArray: 0,
         position: "back",
      },
      stroke: {
         curve: "smooth",
         fill: {
            colors: ["red"],
         },
      },
      // @ts-expect-error: I dont know what this is
      markers: false,
   };

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getCookieValue();

         const products = await getProducts();

         let len = (products.length <= 5) ? products.length : 5;
         let idx = 0;

         const DataInState: number[] = [];
         const DataInCatagories: string[] = [];

         if (user.role == "admin") {
            for (let i = 0; i < len; i++) {
               if (DataInCatagories.includes(products[idx].name)) {
                  DataInState[DataInCatagories.indexOf(products[idx].name)] += products[idx].totalSell;
                  if (products.length > 5) --i;
                  else --len;
                  idx++;
                  continue;
               }
               DataInState.push(products[idx].totalSell);
               DataInCatagories.push(products[idx].name);

               idx++;
            }

            setDataInState(DataInState);
            setCatagories(DataInCatagories);

            return;
         }

         const p = products.filter((product) => product.branchId == user.branchId);

         len = (p.length <= 5) ? p.length : 5;

         for (let i = 0; i < len; i++) {
            if (DataInCatagories.includes(p[idx].name)) {
               DataInState[DataInCatagories.indexOf(p[idx].name)] += p[idx].totalSell;
               if (p.length > 5) --i;
               else --len;
               idx++;
               continue;
            }
            DataInState.push(p[idx].totalSell);
            DataInCatagories.push(p[idx].name);

            idx++;
         }

         setDataInState(DataInState);
         setCatagories(DataInCatagories);

         return;

      }
      getData()
   }, [])


   return (
      <>
         <div className="w-full z-20">
            <div id="chart">
               <Chart options={options} series={state} type="bar" height={425} />
            </div>
         </div>
      </>
   );
};
