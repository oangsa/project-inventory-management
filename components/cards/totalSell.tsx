"use client";

import { Card, CardBody } from "@nextui-org/react";
import {  User } from "@/interfaces/controller-types";
import { useState, useEffect } from "react";
import getProducts from "@/libs/getProducts";
import getCookieValue from "@/libs/getCookieValue";

export default function TotalSellCard() {
   const [data, setData] = useState<number>(0);

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getCookieValue();
         const products = await getProducts();

         let totalSold = 0;

         products.map((product) => {
            if (user.role === "admin") totalSold += product.totalSell;

            if (user.role !== "admin") {
               if (product.useInBranch.id === user.branchId) {
                  totalSold += product.totalSell;
               }
            }
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
               <span className="text-white text-xl font-semibold">{data.toLocaleString()} Products Sold</span>
            </div>
         </CardBody>
      </Card>
   )
}
