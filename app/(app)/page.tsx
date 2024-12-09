"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TotalEarningCard from "@/components/cards/totalEarning";
import TotalProductCard from "@/components/cards/totalProduct";
import TotalSellCard from "@/components/cards/totalSell";
import LatestEditCard from "@/components/cards/lastEditCard";
import getDataByCookie from "@/libs/getUserByCookie";
import { User } from "@/interfaces/controller-types";

const Chart = dynamic(
  () => import("@/components/charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export default function Home() {
   const [user, setUser] = useState<User>({} as User);

   const getData = useCallback(async () => {
      const editor = await getDataByCookie();

      return setUser(editor.user as User);
    }, [])

    // Fetch Data
    useEffect(() => {
      getData()
    }, [getData]);


   return (
      <div className="h-full lg:px-6">
        <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
          <div className="mt-6 gap-6 flex flex-col w-full">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Data</h3>
              <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
                  <Suspense fallback={<div>Loading</div>}>
                     <TotalProductCard />
                     <TotalSellCard />
                     <TotalEarningCard />
                  </Suspense>
              </div>
            </div>
            <div className="h-full flex flex-col gap-2">
              <h3 className="text-xl font-semibold">Top Sold Products</h3>
              <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
               <Suspense fallback={<div>Loading</div>}>
                  <Chart />
               </Suspense>
              </div>
            </div>
          </div>
          <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
            <h3 className="text-xl font-semibold">Section</h3>
            <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
               <Suspense fallback={<div>Loading</div>}>
                  <LatestEditCard />
               </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
}
