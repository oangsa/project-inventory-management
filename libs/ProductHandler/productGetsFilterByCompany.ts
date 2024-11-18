'use server'

import { Product, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"

export default async function getCompanyProducts(user: User): Promise<Product[]> {

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