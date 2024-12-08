"use server"

import { User, Product } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function getTotalSellPrice(user: User): Promise<number> {
   let totalSell: number = 0;

   const products = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      }
   }) as Product[];

   products.forEach((product: Product) => {
      totalSell += (product.totalSell * product.price);
   })


   return totalSell;
}
