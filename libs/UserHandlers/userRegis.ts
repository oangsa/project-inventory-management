"use server"

import prisma from '@/libs/prismadb'
import { InviteCode, User } from '../../interfaces/controller-types'

export default async function regisHandler(username: string, password: string, name: string, token: string): Promise<Record<string, string | number | User>> {

    const checkToken = await prisma.inviteCode.findFirst({
        where: {
            code: token
        },
        include: {
            creater: true
        }
    }) as InviteCode;

    if (!checkToken || checkToken.isUse) return {"status": 204, "message": "Invalid invite code provided or invite code is already expried."}

    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    }) as User

    if (user) return {"status": 409, "message": "Username already in use."}

    const newUser = await prisma.user.create({
        data: {
            name: name,
            username: username,
            password: password,
            role: checkToken.providedRole,
            branchId: checkToken.useInBranch,
            companyId: checkToken.creater.companyId   
        }
    })

    if (newUser) {
        await prisma.inviteCode.update({
            where: {
                code: token
            },
            data: {
                isUse: true
            }
        })
    }

    return {"status": 200, "message": "User created! Please login again."}
}