"use server"
import prisma from '@/libs/prismadb'
import { User, roles } from '../../interfaces/controller-types'
import { encryptPassword } from '../passwordManager'

export default async function updateUserHandler(role: roles, branch: string, newUser: User, oldUser: User, Editor: User): Promise<Record<string, string | number | User>> {

   if (Editor.role != "admin" && newUser.role == "admin") return {"status": 401, "message": "Unauthorized!"}

   const passwordValidation = (password: string): boolean => {
      const specialChars = '@$!%*?&.';
      const upper = /\p{Lu}/u
      const lower = /\p{Ll}/u
      const number = /\d/

      if (password == "") return false

      return !(upper.test(password) && lower.test(password) && specialChars.split('').some(char => password.includes(char)) && number.test(password) && password != "")
   }

   if (passwordValidation(newUser.password)) return {"status": 400, "message": "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."}

   newUser.username = newUser.username.toLowerCase()

   const checkUser = await prisma.user.findFirst({
      where: {
         username: newUser.username,
      }
   }) as User

   if (checkUser && newUser.username != oldUser.username) return {"status": 409, "message": `Provided username already exist!`}

   if (newUser.password == "" || newUser.password == oldUser.password) newUser.password = oldUser.password
   else newUser.password = await encryptPassword(newUser.password)

   const updated = await prisma.user.update({
      where: {
         id: oldUser.id,
      },
      data: {
         image: newUser.image,
         name: newUser.name,
         username: newUser.username,
         password: newUser.password,
         role: role,
         branchId: branch,
      }
   }) as User

   const user = await prisma.user.findFirst({
      where: {
         id: oldUser.id,
      },
      include: {
         branch: true,
         company: true,
      }
   }) as User

   if (!updated) return {"status": 404, "message": "User not found"}

   return {"status": 200, "message": "User updated.", "user": user}
}
