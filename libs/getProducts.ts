"use server";

import { Product, roles, User } from '@/interfaces/controller-types';
import prisma from '@/libs/prismadb';

export default async function getProducts(user: User): Promise<Product[]> {
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
