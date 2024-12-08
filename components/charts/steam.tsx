"use client"

import getProducts from "@/libs/getProducts";
import getDataByCookie from "@/libs/getUserByCookie";
import { User } from "@/interfaces/controller-types";
import { useEffect, useState } from "react";
import Chart, { Props } from "react-apexcharts";

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
            easing: "linear",
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
      // @ts-ignore
      markers: false,
   };

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getDataByCookie();

         const products = await getProducts(user.user as User);

         let len = (products.length <= 5) ? products.length : 5;
         let DataInState: number[] = [];
         let DataInCatagories: string[] = [];

         for (let i = 0; i < len; i++) {
            DataInState.push(products[i].totalSell);
            DataInCatagories.push(products[i].name);

         }

         setDataInState(DataInState);
         setCatagories(DataInCatagories);

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
