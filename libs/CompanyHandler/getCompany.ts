"use server";

import prisma from '@/libs/prismadb'
import { Company, User } from '@/interfaces/controller-types'

export default async function getCompany(user: User): Promise<Record<string, string | number | Company>> {
    const company = await prisma.company.findFirst({
        where: {
            id: user.companyId
        },
        include: {
            Branch: true
        }
    }) as Company

    if (!company) return {"status": 404, "message": "Unable to find company."}

    return {"status": 200, "message": "success", "company": company}
}
