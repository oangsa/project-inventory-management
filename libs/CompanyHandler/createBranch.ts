'use server'

import { Branch, Company, providers, User } from "@/interfaces/controller-types";
import prisma from '@/libs/prismadb'

export default async function branchCreate(name: string, provider: providers, dependency: string, noti: number, company: Company, user?: User, isFirst?: boolean,): Promise<Record<string, number | string | Branch>> {

   if (!name || !provider || !dependency || !noti || !company) return {"status": 400, "message": "Please provide all required fields."}

    // Checking if user have a permission to create a branch.
   if ((!isFirst && !user) || user?.role == "employee") return {"status": 401, "message": "Unauthorized!"};


    // Checking if the provided branch name is already exist.
   const checkBranch = await prisma.branch.findFirst({
      where: {
         name: name,
         companyId: company.id
      }
   })

   if (checkBranch) return {"status": 409, "message": `Branch name ${name} is already exist.`}

   const new_branch = await prisma.branch.create({
      data: {
         name: name,
         companyId: company.id,
         lowestNoti: noti,
         provider: provider,
         dependencies: dependency
      }
   }) as Branch

   if (!new_branch) return {"status": 520, "message": "Unknown error occured."}

   return {"status": 200, "message": "Success", "branch": new_branch}
}
