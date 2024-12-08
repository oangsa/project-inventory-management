"use server"
import prisma from '@/libs/prismadb'
import { Product } from '../../interfaces/controller-types'

export default async function updateProductHandler(new_prod_data: Product, old_prod_data: Product): Promise<Record<string, number | string | Product>> {

    // Checking if product exist or not.
    const checkProd = await prisma.product.findFirst({
        where: {
            name: new_prod_data.name,
            branchId: new_prod_data.branchId,
            companyId: new_prod_data.companyId
        }
    }) as Product

    if (checkProd && new_prod_data.name != old_prod_data.name) return {"status": 409, "message": `Product named '${new_prod_data.name}' already exist in the branch '${new_prod_data.useInBranch.name}'.`}

    console.log(old_prod_data.remain - new_prod_data.remain)

    const new_prod = await prisma.product.update({
        where: {
            id: old_prod_data.id
        },
        data: {
            productCode: new_prod_data.productCode,
            name: new_prod_data.name,
            price: new_prod_data.price,
            remain: new_prod_data.remain,
            totalSell: (new_prod_data.remain >= old_prod_data.remain) ? checkProd.totalSell : checkProd.totalSell + (old_prod_data.remain - new_prod_data.remain),

            // Checking if stock is increasing
            latestRefill: (new_prod_data.remain <= old_prod_data.remain) ? new_prod_data.latestRefill : new Date(),

            latestEdit: new Date()
        }
    }) as Product

    return {"status": 200, "message": `Product updated.`, "product": new_prod};
}
