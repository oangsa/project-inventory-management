"use server";

import prisma from "@/libs/prismadb";
import { User } from "@/interfaces/controller-types";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "../auth";
import { cookies } from "next/headers";

export default async function findUserForResetPassword(prevState: any, data: FormData): Promise<Record<string, string | number | User>> {
   const username = data.get("username") as string;

   const res = await prisma.user.findUnique({
      where: {
         username: username
      }
   }) as User

   if (!res) {
      return {"status": 404, "message": "User not found"}
   }

   const user = {
      id: res.id,
      username: res.username,
   }

   const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256', user})
      .setJti(nanoid())
      .setExpirationTime('1 days')
      .sign(new TextEncoder().encode(getJwtSecretKey()))

   const cookieStore = await cookies();

   cookieStore.set('resetToken', token as string, {
      maxAge: 60 * 60 * 24,
   })

   return {"status": 200, "message": "User found", "user": res}
}
