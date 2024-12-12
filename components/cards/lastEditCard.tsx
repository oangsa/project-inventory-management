"use client"

import { Product, roles, User } from "@/interfaces/controller-types";
import getLatestProducts from "@/libs/ProductHandler/productsGetLatest";
import getDataByCookie from "@/libs/getUserByCookie";
import { Card, CardBody, Avatar } from "@nextui-org/react";
import { useState, useEffect } from "react";
import ReactTimeAgo from "react-time-ago";

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import getCookieValue from "@/libs/getCookieValue";

TimeAgo.addLocale(en)

export default function LatestEditCard() {
   const [items, setItems] = useState<Product[]>([])
   let i = 0;

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getCookieValue();
         const products = await getLatestProducts();

         if (user.role == "admin") return setItems(products);

         const filtered = products.filter((product) => product.useInBranch.id === user.branchId)

         return setItems(filtered);
      }

      getData();

   }, [])

   return (
      <Card className=" bg-default-50 rounded-xl shadow-md px-3">
         <CardBody className="py-5 gap-4">
            <div className="flex gap-2.5 justify-center">
               <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                  <span className="text-default-900 text-xl font-semibold">
                     Latest Update
                  </span>
               </div>
            </div>

            <div className="flex flex-col gap-6 ">
               <div className="grid grid-cols-4 w-full">
                  <span className="text-default-900 font-bold">Product</span>
                  <span className="text-default-900 font-bold">Branch</span>
                  <span className="text-default-900 font-bold">Remain</span>
                  <span className="text-default-900 font-bold">Last Edit</span>
               </div>
               {items.map((item: Product) => (
                  <div key={item.name + (i++).toString()} className="grid grid-cols-4 w-full">
                     <span className="text-default-900  font-semibold">
                        {item.name}
                     </span>
                     <div>
                        <span className="text-default-900 text-sm">{item.useInBranch.name}</span>
                     </div>
                     <div>
                        <span className="text-success text-xs">{item.remain.toLocaleString()}</span>
                     </div>
                     <div>
                        <span className="text-default-500 text-xs">{<ReactTimeAgo date={item.latestEdit.getTime()} locale="en-US"/>}</span>
                     </div>
                  </div>
               ))}
            </div>
         </CardBody>
      </Card>
   )
}
