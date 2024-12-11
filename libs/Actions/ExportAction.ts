"use server";

import { Product, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function exportProductAction(prevState: any, queryData: FormData): Promise<Record<string, string | number | Product[]>> {
   const mode = queryData.get("modeSelect") as string;
   const branch = queryData.get("assignedBranch") as string;
   const company = queryData.get("company") as string;

   if (!mode) return {"status": 400, "message": "Please select a mode"}

   if (mode == "branch") {
      if (!branch) return {"status": 400, "message": "Please select a branch"}

      const data = await prisma.product.findMany({
         where: {
            branchId: branch
         },
         include: {
            useInBranch: true
         }
      }) as Product[]

      if (data.length <= 0 || !data) return {"status": 400, "message": "No products found"}

      return {"status": 200, "message": "Success" , "products": data}
   }

   const data = await prisma.product.findMany({
      where: {
         companyId: company
      },
      include: {
         useInBranch: true
      }
   }) as Product[]

   if (data.length <= 0 || !data) return {"status": 400, "message": "No products found"}

   return {"status": 200, "message": "Success" , "products": data}
}
