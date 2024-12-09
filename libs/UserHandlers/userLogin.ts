"use server"

import prisma from '@/libs/prismadb'
import { User } from '../../interfaces/controller-types'
import { decryptPassword } from '../passwordManager';

export default async function loginHandler(username: string, password: string): Promise<Record<string, number | string | User>> {
   username = username.toLowerCase();

   const checkUser = await prisma.user.findFirst({
      where: {
         username: username,
      }
   }) as User

   if (!checkUser) return {"status": 409, "message": "User not found."}

   if (!await decryptPassword(password, checkUser.password)) return {"status": 401, "message": "Invalid password."}

   return {"status": 200, "message": "success!", "user": checkUser}
}
