import { InviteCode, roles, User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb'

export default async function createInviteCode(role: roles, creater: User): Promise<InviteCode | Record<string, string>> {
    var generatedToken = Math.random().toString(36).slice(2);
    
    var checkToken = await prisma.inviteCode.findFirst({
        where: {
            code: generatedToken
        }
    })

    // Check if token is already existed. if exist just loop until find the unique one.
    while (checkToken) {
        generatedToken = Math.random().toString(36).slice(2);
        
        var checkToken = await prisma.inviteCode.findFirst({
            where: {
                code: generatedToken
            }
        })
    }

    const newToken = await prisma.inviteCode.create({
        data: {
            id: "",
            code: generatedToken,
            providedRole: role,
            createrId: creater.id,
            expiredDate: (Date.now()).toString()
        }
    }) as InviteCode

    return newToken;
}