"use server"
import prisma from '@/libs/prismadb'
import { User, roles } from '../../interfaces/controller-types'

export default async function updateUserHandler(role: roles, branch: string, newUser: User, oldUser: User, Editor: User): Promise<Record<string, string | number | User>> {
    console.log(newUser)
    if (Editor.role != "admin" && newUser.role == "admin") return {"status": 401, "message": "Unauthorized!"}

    const checkUser = await prisma.user.findFirst({
        where: {
            username: newUser.username,
        }
    }) as User

    if (checkUser && newUser.username != oldUser.username) return {"status": 409, "message": `Provided username already exist!`}

    const user = await prisma.user.update({
        where: {
            id: oldUser.id,
        },
        data: {
            name: newUser.name,
            username: newUser.username,
            password: newUser.password,
            role: role,
            branchId: branch,
        }
    }) as User

    if (!user) return {"status": 404, "message": "User not found"}

    return {"status": 200, "message": "User updated", "user": user}
}
