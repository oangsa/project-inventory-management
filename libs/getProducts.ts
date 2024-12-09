"use server";

import { Product, User } from '@/interfaces/controller-types';
import prisma from '@/libs/prismadb';

export default async function getProducts(user: User): Promise<Product[]> {
   const products = await prisma.product.findMany({
      where: {
         companyId: user.companyId,
      },
      orderBy: {
         totalSell: "desc"
      }
   }) as Product[];

   return products;
}
