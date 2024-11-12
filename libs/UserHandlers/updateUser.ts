"use server"
import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'

export default async function updateUserHandler(username: string, password: string): Promise<User | undefined> {
    // Need to be implemented.
    const user = await prisma.user.update({
        where: {
            username: username,
            password: password
        },
        data: {
            joinDate: new Date()
        }
    }) as User
    
    if (!user) return undefined

    return user
}