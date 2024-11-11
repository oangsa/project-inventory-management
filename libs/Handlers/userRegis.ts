"use server"
import prisma from '@/libs/prismadb'
import { InviteCode, User } from '../../interfaces/controller-types'

export default async function regisHandler(username: string, password: string, token: string, name: string): Promise<User | Record<string, string | number>> {

    const checkToken = await prisma.inviteCode.findFirst({
        where: {
            code: token
        }
    }) as InviteCode;

    if (!checkToken) return {"status": 204, "message": "Invalid invite code provided or invite code is already expried."}

    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    }) as User

    if (user) return {"status": 409, "message": "Username already in used."}

    const newUser = await prisma.user.create({
        data: {
            name: name,
            username: username,
            password: password,
            role: checkToken.providedRole,
            branch: checkToken.creater.branch,
            companyId: checkToken.creater.companyId   
        }
    })

    console.log(newUser)

    return {"status": 200, "message": "User created! Please login again."}
}