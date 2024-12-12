'use server'

import { Product } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"
import getCookies from "../getCookies";

export default async function getCompanyProducts(): Promise<Product[]> {
   const cookies = await getCookies()

   const product = await prisma.product.findMany({
      where: {
         companyId: cookies.companyId,
      },
      include: {
         useInCompany: true,
         useInBranch: true
      }
   }) as Product[]

   return product
}
