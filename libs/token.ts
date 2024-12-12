"use server"
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "./auth";
import { User } from "@/interfaces/controller-types";

export default async function getToken(res: User) {

   const user = {
      id: res.id,
      username: res.username,
      role: res.role,
      branchId: res.branchId,
      companyId: res.companyId,
      company: res.company,
      branch: res.branch,
   }
   // Create a new cookie.
   const token = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256', user})
      .setJti(nanoid())
      .setExpirationTime('30 days')
      .sign(new TextEncoder().encode(getJwtSecretKey()))

   return token
}
