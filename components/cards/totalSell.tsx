"use client";

import getDataByCookie from "@/libs/getUserByCookie";
import { Card, CardBody } from "@nextui-org/react";
import { User } from "@/interfaces/controller-types";
import { useState, useEffect } from "react";
import getProducts from "@/libs/getProducts";

export default function TotalSellCard() {
   const [data, setData] = useState<number>(0);

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getDataByCookie();
         const products = await getProducts(user.user as User);

         let totalSold = 0;

         products.map((product) => {
            totalSold += product.totalSell;
         })

         return setData(totalSold);
      }
      getData();
   }, [])

   return (
      <Card className="xl:max-w-sm bg-success rounded-xl shadow-md px-3 w-full">
         <CardBody className="py-5">
            <div className="flex gap-2.5">
               <div className="flex flex-col">
                  <span className="text-white">Total Sold</span>
               </div>
            </div>
            <div className="flex gap-2.5 py-2 items-center">
               <span className="text-white text-xl font-semibold">{data.toString()} Products Sold</span>
            </div>
         </CardBody>
      </Card>
   )
}
