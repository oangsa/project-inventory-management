'use server'

import { User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb'

export default async function getUserData(token: any): Promise<User> {

    // Yeah. Read the function name, that already explain the ustage of this code.
    const user = await prisma.user.findFirst({
        where: {
            username: token.user.username,
            password: token.user.password
        },
        include: {
            company: true,
            branch: true,
            CreatedInviteCode: true
        }
    }) as User;

    return user;
}
