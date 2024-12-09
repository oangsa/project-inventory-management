"use server"

import { Branch, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function getBranch(branchId: string): Promise<Branch> {

   if (!branchId) {
      return {} as Branch;
   }

   const branch = await prisma.branch.findFirst({
      where: {
         id: branchId
      }
   }) as Branch;

   return branch;
}
