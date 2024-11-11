'use server'

import { InviteCode, roles, User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb'

export default async function createInviteCode(role: roles, creater: User): Promise<Record<string, string | number | InviteCode>> {
    if (creater.role == "employee") return {"status": 401, "message": "Unautorized!"};
    
    var generatedToken = Math.random().toString(36).slice(2);
    
    var checkToken = await prisma.inviteCode.findFirst({
        where: {
            code: generatedToken
        }
    })

    // Check if token is already existed. if exist just loop until find the unique one.
    while (checkToken) {
        generatedToken = Math.random().toString(36).slice(2);
        
        checkToken = await prisma.inviteCode.findFirst({
            where: {
                code: generatedToken
            }
        })
    }

    const newToken = await prisma.inviteCode.create({
        data: {
            code: generatedToken,
            providedRole: role,
            createrId: creater.id,
            expiredDate: new Date()
        }
    }) as InviteCode

    return {"status": 200, "message": "success", "token": newToken};
}