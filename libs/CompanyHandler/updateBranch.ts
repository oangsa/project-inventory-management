"use server"

import { Branch } from '@/interfaces/controller-types'
import prisma from '@/libs/prismadb'


export default async function updateBranchHandler(newBranch: Branch, oldBranch: Branch): Promise<Record<string, string | number | Branch>> {
    const checkBranch = await prisma.branch.findFirst({
        where: {
            id: oldBranch.id
        }
    })

    if (!checkBranch) return {"status": 404, "message": "Branch not found."}

    const sameBranch = await prisma.branch.findFirst({
        where: {
            companyId: oldBranch.companyId,
            name: newBranch.name
        }
    })

    if (sameBranch && (newBranch.name != oldBranch.name)) return {"status": 409, "message": `Branch named ${newBranch.name} is already in use.`}

    const updatedBranch = await prisma.branch.update({
        where: {
            id: oldBranch.id
        },
        data: {
            name: newBranch.name,
            provider: newBranch.provider,
            dependencies: newBranch.dependencies,
            lowestNoti: newBranch.lowestNoti
        }
    }) as Branch

    return {"status": 200, "message": "Branch updated.", "branch": updatedBranch}
}
