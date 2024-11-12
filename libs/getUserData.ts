'use server'

import { User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb'

export default async function getUserData(token: any): Promise<User> {

    const user = await prisma.user.findFirst({
        where: {
            username: token.res.username,
            password: token.res.password
        },
        include: {
            company: true,
            branch: true,
            CreatedInviteCode: true
        }
    }) as User;
    
    return user;
}