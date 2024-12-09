"use server"

import { User, Product, roles } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function getTotalSellPrice(user: User, filter: roles): Promise<number> {
   let totalSell: number = 0;

   const products = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      },
      include: {
         useInBranch: true,
      }
   }) as Product[];

   products.forEach((product: Product) => {
      if (filter === "admin") totalSell += (product.totalSell * product.price);

      if (filter !== "admin") {
         if (product.useInBranch.id === user.branchId) {
            totalSell += (product.totalSell * product.price);
         }
      }

   })


   return totalSell;
}
