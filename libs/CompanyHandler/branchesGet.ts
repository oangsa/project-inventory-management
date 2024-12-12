"use server"

import { User, Branch } from "@prisma/client"
import prisma from "@/libs/prismadb"
import getCookieValue from "../getCookieValue"

export default async function getBranches(): Promise<Branch[]> {

   const user = await getCookieValue() as User

   const branches = await prisma.branch.findMany({
      where: {
         companyId: user.companyId
      },
      include: {
         User: true,
         Stock: true
      }
   }) as Branch[]

   console.log(branches)

   return branches
}
