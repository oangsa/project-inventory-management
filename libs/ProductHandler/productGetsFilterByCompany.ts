'use server'

import { Product } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"
import getCookieValue from "../getCookieValue";

export default async function getCompanyProducts(): Promise<Product[]> {
   const user = await getCookieValue()

   const product = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      },
      include: {
         useInCompany: true,
         useInBranch: true
      }
   }) as Product[]

   return product
}
