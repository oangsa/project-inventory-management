import { Product, roles, User } from "@/interfaces/controller-types";
import getProducts from "@/libs/getProducts";
import getTotalSellPrice from "@/libs/getTotalSellPrice";
import getDataByCookie from "@/libs/getUserByCookie";
import { Card, CardBody } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function TotalEarningCard() {
   const [data, setData] = useState<number>(0);

   useEffect(() => {
      async function getData(): Promise<void> {
         const user = await getDataByCookie();
         const products = await getProducts(user.user as User);

         let totalSell = 0;

         for (const product of products) {
            if ((user.user as User).role == "admin") totalSell += (product.totalSell * product.price);

            if ((user.user as User).role != "admin") {
               console.log(product.useInBranch.id, (user.user as User).branchId);
               if (product.useInBranch.id == (user.user as User).branchId) {
                  totalSell += (product.totalSell * product.price);
               }
            }
         }

         return setData(totalSell);
      }

      getData();
   }, [])


   return (
      <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
        <CardBody className="py-5 overflow-hidden">
          <div className="flex gap-2.5">
            <div className="flex flex-col">
              <span className="text-white">Total Earning</span>
              {/* <span className="text-white text-xs">1311 Cars</span> */}
            </div>
          </div>
          <div className="flex gap-2.5 py-2 items-center">
            <span className="text-white text-xl font-semibold">{data.toString()}.-</span>
            {/* <span className="text-success text-xs">+ 4.5%</span> */}
          </div>
        </CardBody>
      </Card>
    );
}
