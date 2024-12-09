"use server"

import { User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"

export default async function getUsers(user: User): Promise<Record<string, string | number | User[]>> {

    const users = await prisma.user.findMany({
        where: {
            companyId: user.companyId
        },
        include: {
            company: true,
            branch: true
        }
    }) as User[];


    return {"status": 200, "message": "Success", "users": users};
}
