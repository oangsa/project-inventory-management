"use server";

import { Product, roles, User } from '@/interfaces/controller-types';
import prisma from '@/libs/prismadb';
import getCookieValue from './getCookieValue';

export default async function getProducts(): Promise<Product[]> {
   const user = await getCookieValue();

   const products = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      },
      orderBy: {
         totalSell: "desc"
      },
      include: {
         useInBranch: true
      }
   }) as Product[];

   return products;
}
