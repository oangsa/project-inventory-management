'use server'

import { Product, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"

export default async function getProducts(user: User): Promise<Product[]> {

    const product = await prisma.product.findMany({
        where: {
            companyId: user.companyId,
            branchId: user.branchId
        }
    }) as Product[]

    return product
}