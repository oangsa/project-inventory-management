"use server"

import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'
import { decryptPassword } from '../passwordManager';
import getToken from '../token';
import { cookies } from 'next/headers'

export default async function loginHandler(username: string, password: string): Promise<Record<string, number | string | User>> {
   username = username.toLowerCase();
   const cookieStore = await cookies()

   const checkUser = await prisma.user.findFirst({
      where: {
         username: username,
      },
      include: {
         branch: true,
         company: true,
      }
   }) as User

   if (!checkUser) return {"status": 409, "message": "User not found."}

   if (!await decryptPassword(password, checkUser.password)) return {"status": 401, "message": "Invalid password."}

   const token = await getToken(checkUser as User)

   cookieStore.set("user-token", token, { maxAge: 30 * 24 * 3600, httpOnly: true })

   return {"status": 200, "message": "success!", "user": checkUser}
}
