"use server";

import { Product, User } from "@/interfaces/controller-types";
import getDataByCookie from "../getUserByCookie";
import productCreate from "../ProductHandler/productCreate";
import { revalidatePath, revalidateTag } from "next/cache";

export default async function addProductAction(prevState: any, queryData: FormData) {
   const productCode = queryData.get("productCode") as string;
   const productName = queryData.get("name") as string;
   const productPrice = parseFloat(queryData.get("price") as string) as number;
   const productRemain = parseInt(queryData.get("remain") as string) as number;
   const productBranch = queryData.getAll("assignedBranch") as string[];

   if (!productCode || !productName || !productPrice || !productRemain || !productBranch[0]) {
      return { status: 400, message: "Please provide all required fields." }
   }

   const d = {
      productCode: productCode,
      name: productName,
      remain: productRemain,
      price: productPrice,
      branchId: productBranch[0]
   } as Product

   const user = await getDataByCookie();

   if (user.status != 200) return user

   const res = await productCreate(d, user.user as User);

   revalidatePath("/admin/products", "page");

   return res
}
