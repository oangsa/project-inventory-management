"use server"

import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'

export default async function loginHandler(username: string, password: string): Promise<Record<string, number | string | User>> {

    const user = await prisma.user.findFirst({
        where: {
            username: username,
            password: password
        },
        include: {
            company: true,
            branch: true,
            CreatedInviteCode: true
        }
    }) as User
    
    if (!user) return {"status": 409, "message": "User not found."}

    return {"status": 200, "message": "success!", "user": user}
}