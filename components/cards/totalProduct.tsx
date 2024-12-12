"use client";

import getProducts from "@/libs/getProducts";
import { CardBody, Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
import getCookieValue from "@/libs/getCookieValue";

export default function TotalProductCard() {
   const [data, setData] = useState<number>(0);

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getCookieValue();

         const totalProduct = await getProducts();

         if (user.role === "admin") return setData(totalProduct.length);

         const filtered = totalProduct.filter((product) => product.useInBranch.id == user.branchId)

         return setData(filtered.length);
      }
      getData()
   }, [])

   return (
      <Card className="xl:max-w-sm bg-default-50 rounded-xl shadow-md px-3 w-full">
        <CardBody className="py-5">
          <div className="flex gap-2.5">
            <div className="flex flex-col">
              <span className="text-default-900">Total Products</span>
              <span className="text-default-900 text-xs"></span>
            </div>
          </div>
          <div className="flex gap-2.5 py-2 items-center">
            <span className="text-default-900 text-xl font-semibold">
               {data.toString()} Products
            </span>
            {/* <span className="text-danger text-xs">- 4.5%</span> */}
          </div>
        </CardBody>
      </Card>
    );
}
