"use server"

import { User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"
import getCookieValue from "../getCookieValue";

export default async function getUsers(): Promise<Record<string, string | number | User[]>> {
   const user = await getCookieValue();

   const users = await prisma.user.findMany({
      where: {
         companyId: user.companyId
      },
      include: {
         company: true,
         branch: true
      }
   }) as User[];


   return {"status": 200, "message": "Success", "users": users};
}
