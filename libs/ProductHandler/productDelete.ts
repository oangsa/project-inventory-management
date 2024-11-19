'use server'

import prisma from '@/libs/prismadb'

export async function deleteProductHandler(productId: string): Promise<Record<string, string | number>> {

    const del_product = await prisma.product.delete({
        where: {
            id: productId
        }
    })

    // Checking if product exist or not.
    if (!del_product) return {"status": 404, "message": "Product not found"};


    return {"status": 200, "message": `'${del_product.name}' has successfully been deleted!`}
}