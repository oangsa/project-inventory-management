"use server"

import prisma from '@/libs/prismadb'
import { Company } from '@/interfaces/controller-types'
import { logoutHandler } from '../UserHandlers/logout'

export default async function deleteCompanyHandler(companyId: string): Promise<Record<string, string | number>> {

   const checkCompany = await prisma.company.findFirst({
      where: {
         id: companyId
      }
   }) as Company

   if (!checkCompany) return {"status": 404, "message": "Company not found."}

   await prisma.user.deleteMany({
      where: {
         companyId: companyId
      }
   })

   await prisma.branch.deleteMany({
      where: {
         companyId: companyId
      }
   })

   await prisma.product.deleteMany({
      where: {
         companyId: companyId
      }
   })

   await prisma.company.delete({
      where: {
         id: companyId
      }
   });

   await logoutHandler();

   return {"status": 200, "message": `'${checkCompany.name}' has been deleted.`}
}
