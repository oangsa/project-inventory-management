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
      },
      include: {
         useInBranch: true,
         useInCompany: true
      },
      take: 8
   }) as Product[];

   return products;
}
