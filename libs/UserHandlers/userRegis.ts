"use server"

import prisma from '@/libs/prismadb'
import { InviteCode, User } from '../../interfaces/controller-types'
import { encryptPassword } from '../passwordManager';

export default async function regisHandler(username: string, password: string, name: string, token: string, image: string, assignedRole?: string, assignedBranch?: string ,creater?: User): Promise<Record<string, string | number | User>> {

   if (!username || !password || !name || (!token && !creater)) return {"status": 400, "message": "Please provide all required fields."}

   const passwordValidation = (password: string): boolean => {
      const specialChars = '@$!%*?&.';
      const upper = /\p{Lu}/u
      const lower = /\p{Ll}/u
      const number = /\d/

      if (password == "") return false

      return !(upper.test(password) && lower.test(password) && specialChars.split('').some(char => password.includes(char)) && number.test(password) && password != "")
   }

   if (passwordValidation(password)) return {"status": 400, "message": "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."}

   // Username is now not case sensitive.
   username = username.toLowerCase();
   password = await encryptPassword(password);

   // Checking if the provided token is valid.
   const checkToken = await prisma.inviteCode.findFirst({
      where: {
         code: token
      },
      include: {
         creater: true
      }
   }) as InviteCode;

   if ((!checkToken || checkToken.isUse) && !creater) return {"status": 204, "message": "Invalid invite code or invite code is already expried."}

   // Checking if username is already used.
   const user = await prisma.user.findFirst({
      where: {
         username: username
      }
   }) as User

   if (user) return {"status": 409, "message": "Username already in use."}

   const role = (!creater) ? checkToken.providedRole : (assignedRole as string);
   const branch = (!creater) ? checkToken.useInBranch : (assignedBranch as string);
   const companyId = (!creater) ? checkToken.creater.companyId : creater.companyId;

   const newUser = await prisma.user.create({
      data: {
         name: name,
         username: username,
         password: password,
         role: role,
         image: image,
         branchId: branch,
         companyId: companyId
      }
   })

   if (newUser && !creater) {
      await prisma.inviteCode.update({
         where: {
               code: token
         },
         data: {
               isUse: true
         }
      })
   }

   const msg = (!creater) ? "User created! Please login again." : "User created!"

   return {"status": 200, "message": msg}
}
