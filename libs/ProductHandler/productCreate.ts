'use server'

import { Product, User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb';

export default async function productCreateHandler(prodData: Product, user: User): Promise<Record<string, string | number | Product | User>> {

    const checkProd = await prisma.product.findFirst({
        where: {
            name: prodData.name,
            branchId: user.branchId,
            companyId: user.companyId,
        }
    })

    // Checking if the given product is already exist
    if (checkProd) return {"status": 409, "message": "The provided product is already existed."}

    const new_prod = await prisma.product.create({
        data: {
            name: prodData.name,
            price: prodData.price,
            remain: prodData.remain,
            branchId: (user as User).branchId,
            companyId: (user as User).companyId,
            latestEdit: new Date(),
            latestRefill: new Date()
        }
    }) as Product

    return {"status": 200, "message": "Success", "product": new_prod};
}