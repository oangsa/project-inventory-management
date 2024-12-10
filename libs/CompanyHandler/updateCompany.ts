"use server";
import { Company, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb";

export default async function updateCompany(data: Company, oldData: Company, editer: User) {
   if (editer.role !== "admin") return { status: 403, message: "You don't have permission to do this action." }

   const company = await prisma.company.update({
      where: {
         id: data.id
      },
      data: {
         name: data.name,
      }
   })

   return { status: 200, message: "Company updated successfully.", company }
}
