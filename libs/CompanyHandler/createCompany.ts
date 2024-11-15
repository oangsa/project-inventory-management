'use server'

import { Branch, Company } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"
import branchCreate from "./createBranch";

export default async function companyCreate(name: string, secret: string): Promise<Record<string, string | number | Company>> {    
    if (secret != process.env.CREATE_COMPANY_SECRET) return {"status": 201, "message": "Ayyyyy"}

    const checkCompany = await prisma.company.findFirst({
        where: {
            name: name
        }
    });

    if (checkCompany) return {"status": 409, "message": `Company named '${name} is already in use.'`}

    const new_company = await prisma.company.create({
        data: {
            name: name
        }
    }) as Company;

    
    const new_branch = await branchCreate("main", "discord", "", 20, new_company, undefined, true);
    
    console.log(new_branch)

    const new_user = await prisma.user.create({
        data: {
            name: `${new_company.name}'s admin`,
            username: `${new_company.name}admin`,
            password: `${new_company.name}admin`,
            branchId: (new_branch.branch as Branch).id,
            role: "admin",
            companyId: new_company.id,
            joinDate: new Date()
        }
    })

    return {"status": 200, "message": "Company has successfully been created.", "company": new_company};

}