"use server"

import { cookies } from "next/headers";
import { verifyAuthAndGetData } from "../auth";
import { User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";
import { decryptPassword, encryptPassword } from "../passwordManager";

export default async function ResetPasswordAction(data: FormData): Promise<Record<string, string | number>> {
   const password = data.get("password") as string;
   const password2 = data.get("password2") as string;

   const cookieStore = await cookies();
   const cookie = cookieStore.get('resetToken')?.value;

   const verifyToken = cookie && (await verifyAuthAndGetData(cookie).catch((err) => {
      console.log(err)
   }));

   if (password !== password2) {
      return {
         status: 400,
         message: "Passwords do not match"
      }
   }

   if (!verifyToken) {
      return {
         status: 400,
         message: "Invalid token"
      };
   }

   const user = verifyToken.user as User;

   const checkUser = await prisma.user.findUnique({
      where: {
         id: user.id
      }
   })

   if (!checkUser) {
      return {
         status: 400,
         message: "User not found"
      }
   }

   if (await decryptPassword(password, checkUser.password)) return {"status": 401, "message": "Password is the same as the old one"}

   const newPassword = await encryptPassword(password);

   await prisma.user.update({
      where: {
         id: user.id
      },
      data: {
         password: newPassword
      }
   })

   cookieStore.delete('resetToken');

   return {
      status: 200,
      message: "Password Reset Successful"
   }
}
