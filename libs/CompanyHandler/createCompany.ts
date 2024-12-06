'use server'

import { Branch, Company, User } from "@/interfaces/controller-types";
import prisma from "@/libs/prismadb"
import branchCreate from "./createBranch";

export default async function companyCreate(name: string, username: string, password: string): Promise<Record<string, string | number | Company | User | Branch>> {
    username = username.toLowerCase();

    // Checking if company name is already exist.
    const checkCompany = await prisma.company.findFirst({
        where: {
            name: name
        }
    });

    if (checkCompany) return {"status": 409, "message": `Company named '${name} is already in use.'`}

    const checkUsername= await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    if (checkUsername) return {"status": 409, "message": `Username is already in use.`}

    const new_company = await prisma.company.create({
        data: {
            name: name
        }
    }) as Company;

    // Create main branch
    const new_branch = await branchCreate("main", "discord", "", 20, new_company, undefined, true);

    if (new_branch.status != 200) {
        await prisma.company.delete({
            where: {
                id: new_company.id
            }
        })

        return {"status": 520, "message": "Unknown Error\nCannot create a branch."};
    }

    // Create Admin
    const new_user = await prisma.user.create({
        data: {
            name: `${new_company.name}'s admin`,
            username: username,
            password: password,
            branchId: (new_branch.branch as Branch).id,
            role: "admin",
            companyId: new_company.id,
            joinDate: new Date()
        }
    })

    if (!new_user) {
        await prisma.company.delete({
            where: {
                id: new_company.id
            }
        })

        await prisma.branch.delete({
            where: {
                id: (new_branch.branch as Branch).id
            }
        })

        return {"status": 520, "message": "Unknown Error\nCannot create a user."};
    }

    return {"status": 200, "message": "Company has successfully been created.\nPlease login again.", "company": new_company, "branch": new_branch.branch, "user": new_user as User};

}
