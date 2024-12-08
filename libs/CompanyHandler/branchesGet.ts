"use server"

import { User, Branch } from "@prisma/client"
import prisma from "@/libs/prismadb"

export default async function getBranches(user: User): Promise<Record<string, string | number | Branch[]>> {
    const branches = await prisma.branch.findMany({
        where: {
            companyId: user.companyId
        },
        include: {
            User: true,
            Stock: true
        }
    }) as Branch[]

    if (!branches) return {"status": 404, "message": "Unable to find branches."}

    return {"status": 200, "message": "success", "branches": branches}
}
