"use server"
import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'

export default async function updateUserHandler(username: string, password: string): Promise<User | undefined> {

    const user = await prisma.user.update({
        where: {
            username: username,
            password: password
        },
        data: {
            joinDate: new Date()
        }
    }) as User

    console.log(user)
    
    if (!user) return undefined

    return user
}