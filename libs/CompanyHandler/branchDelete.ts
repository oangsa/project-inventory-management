"use server"

import prisma from '@/libs/prismadb'
import { Branch } from '@/interfaces/controller-types'

export default async function deleteBranchHandler(branchId: string): Promise<Record<string, string | number>> {
    const checkBranch = await prisma.branch.findFirst({
        where: {
            id: branchId
        }
    }) as Branch;

    if (!checkBranch) return {"status": 404, "message": "Branch not found."}

    await prisma.branch.delete({
        where: {
            id: branchId
        }
    });

    await prisma.user.deleteMany({
        where: {
            branchId: branchId
        }
    })

    await prisma.product.deleteMany({
        where: {
            branchId: branchId
        }
    })

    return {"status": 200, "message": `'${checkBranch.name}' has been deleted.`}
}
