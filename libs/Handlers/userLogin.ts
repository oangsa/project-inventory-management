"use server"
import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'

export default async function loginHandler(username: string, password: string): Promise<User | undefined> {

    const user = await prisma.user.findFirst({
        where: {
            username: username,
            password: password
        },
        include: {
            company: true
        }
    }) as User

    console.log(user)
    
    if (!user) return undefined

    return user
}