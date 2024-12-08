"use server"

import { Product, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function getLatestProducts(user: User): Promise<Product[]> {
   const products = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      },
      orderBy: {
         latestEdit: "desc"
      }
   }) as Product[];

   let a: Product[] = [];
   let count: number = (products.length > 8) ? 8 : products.length;

   for (let i = 0; i < count; i++) {
      a.push(products[i]);
   }

   return a;
}
